#!/usr/bin/env python3
"""Regenerate the SEO block of index.html from content.json.

Everything between <!-- SEO:START --> and <!-- SEO:END --> in index.html is
rebuilt: <title>, meta description, canonical URL, Open Graph, Twitter Card
and the JSON-LD structured data (address, phone, opening hours, services...).

Opening hours are read from the same human-readable lines shown on the site
(content.json > contact > horaires > lines), e.g.:
    ["Mardi, Jeudi", "10h00 - 19h30", "Vendredi", "14h - 19h"]
A line naming days is followed by one or more lines of hours. Supported forms:
    days:  "Mardi", "Mardi, Jeudi", "Mardi et Jeudi", "Lundi au Vendredi",
           "Du lundi au vendredi", "Lundi - Vendredi", "Samedi : 9h - 16h"
    hours: "10h00 - 19h30", "9h-12h", "9h - 12h / 14h - 19h", "10:00 à 19:30"

Run locally:   python3 tools/sync_seo.py          (rewrites index.html)
               python3 tools/sync_seo.py --check  (exit 1 if out of date)
"""
import html
import json
import re
import sys
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
START, END = "<!-- SEO:START -->", "<!-- SEO:END -->"

DAYS = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"]
DAYS_EN = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
DAY_RE = "|".join(DAYS)
TIME = r"(\d{1,2})\s*(?:h|:)\s*(\d{2})?"
RANGE_RE = re.compile(TIME + r"\s*(?:-|–|—|à|a)\s*" + TIME)


class HoursError(ValueError):
    pass


def norm(s):
    s = unicodedata.normalize("NFD", s.lower())
    return "".join(c for c in s if unicodedata.category(c) != "Mn")


def parse_days(text):
    t = norm(text)
    found = re.findall(DAY_RE, t)
    if not found:
        return []
    # A range: "lundi au vendredi", "du lundi au vendredi", "lundi - vendredi"
    m = re.search(rf"({DAY_RE})\s*(?:au|a|-|–|—|jusqu'au)\s*({DAY_RE})", t)
    if m and len(found) == 2:
        a, b = DAYS.index(m.group(1)), DAYS.index(m.group(2))
        if a > b:
            raise HoursError(f"plage de jours inversée : « {text} »")
        return DAYS_EN[a:b + 1]
    return [DAYS_EN[DAYS.index(d)] for d in found]


def parse_ranges(text):
    ranges = []
    for m in RANGE_RE.finditer(norm(text)):
        h1, m1, h2, m2 = m.groups()
        ranges.append((f"{int(h1):02d}:{m1 or '00'}", f"{int(h2):02d}:{m2 or '00'}"))
    return ranges


def parse_hours(lines):
    """Turn the display lines into OpeningHoursSpecification dicts."""
    specs, days = [], None
    for line in lines:
        line_days, line_ranges = parse_days(line), parse_ranges(line)
        if not line_days and not line_ranges:
            if norm(line).strip() in ("", "ferme", "fermé"):
                days = None
                continue
            raise HoursError(f"ligne d'horaires non comprise : « {line} »")
        if line_days:
            days = line_days
        if line_ranges:
            if not days:
                raise HoursError(f"horaires sans jour avant : « {line} »")
            for opens, closes in line_ranges:
                specs.append({
                    "@type": "OpeningHoursSpecification",
                    "dayOfWeek": days,
                    "opens": opens,
                    "closes": closes,
                })
    if not specs:
        raise HoursError("aucun horaire trouvé")
    return specs


def build_json_ld(c):
    contact = c["contact"]
    adresse = contact["adresse"]
    postal, _, locality = adresse["lines"][1].partition(" ")
    phone = re.sub(r"\D", "", contact["telephone"]["value"])
    if phone.startswith("0"):
        phone = "+33" + phone[1:]
    return {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "name": f'{c["hero"]["name"]} - {c["hero"]["title"]}',
        "description": c["site"]["description"],
        "url": c["site"]["url"],
        "telephone": phone,
        "email": contact["email"]["value"],
        "image": c["site"]["ogImage"],
        "priceRange": "$$",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": adresse["lines"][0],
            "postalCode": postal,
            "addressLocality": locality,
            "addressCountry": "FR",
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": adresse["latitude"],
            "longitude": adresse["longitude"],
        },
        "openingHoursSpecification": parse_hours(contact["horaires"]["lines"]),
        "sameAs": [contact["doctolib"]["url"]],
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": c["consultations"]["title"],
            "itemListElement": [
                {"@type": "Offer", "itemOffered": {"@type": "Service", "name": card["title"]}}
                for card in c["consultations"]["cards"]
            ],
        },
    }


def inline_json(v):
    if isinstance(v, dict):
        return "{ " + ", ".join(f"{json.dumps(k, ensure_ascii=False)}: {inline_json(x)}" for k, x in v.items()) + " }"
    if isinstance(v, list):
        return "[" + ", ".join(inline_json(x) for x in v) + "]"
    return json.dumps(v, ensure_ascii=False)


def to_json(v, indent=0, width=140):
    """Pretty JSON that keeps short objects/lists on one line."""
    flat = inline_json(v)
    if not isinstance(v, (dict, list)) or len(flat) + indent <= width:
        return flat
    pad = " " * (indent + 4)
    if isinstance(v, dict):
        items = [f"{pad}{json.dumps(k, ensure_ascii=False)}: {to_json(x, indent + 4, width)}" for k, x in v.items()]
        return "{\n" + ",\n".join(items) + "\n" + " " * indent + "}"
    items = [pad + to_json(x, indent + 4, width) for x in v]
    return "[\n" + ",\n".join(items) + "\n" + " " * indent + "]"


def build_block(c):
    s = c["site"]
    a = lambda v: html.escape(v, quote=True)
    ld = "    " + to_json(build_json_ld(c), indent=4)
    return f"""{START}
    <!-- Bloc généré automatiquement depuis content.json (tools/sync_seo.py) : ne pas modifier à la main -->
    <title>{html.escape(s["title"])}</title>
    <meta name="description" content="{a(s["description"])}">
    <link rel="canonical" href="{a(s["url"])}">
    <!-- Open Graph -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="{a(s["url"])}">
    <meta property="og:title" content="{a(s["title"])}">
    <meta property="og:description" content="{a(s["description"])}">
    <meta property="og:image" content="{a(s["ogImage"])}">
    <meta property="og:locale" content="{a(s["locale"])}">
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary">
    <meta name="twitter:title" content="{a(s["title"])}">
    <meta name="twitter:description" content="{a(s["description"])}">
    <meta name="twitter:image" content="{a(s["ogImage"])}">
    <!-- JSON-LD Structured Data -->
    <script type="application/ld+json">
{ld}
    </script>
    {END}"""


def main():
    content = json.loads((ROOT / "content.json").read_text(encoding="utf-8"))
    index_path = ROOT / "index.html"
    page = index_path.read_text(encoding="utf-8")
    if page.count(START) != 1 or page.count(END) != 1:
        sys.exit("index.html doit contenir une seule paire de marqueurs SEO:START / SEO:END")
    try:
        block = build_block(content)
    except HoursError as e:
        sys.exit(f"Horaires : {e}")
    before, rest = page.split(START)
    _, after = rest.split(END)
    new_page = before + block + after
    if "--check" in sys.argv:
        if new_page != page:
            sys.exit("index.html n'est pas à jour : lancer python3 tools/sync_seo.py")
        print("index.html à jour")
        return
    if new_page != page:
        index_path.write_text(new_page, encoding="utf-8")
        print("index.html mis à jour")
    else:
        print("index.html déjà à jour")


if __name__ == "__main__":
    main()
