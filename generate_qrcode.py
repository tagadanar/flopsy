#!/usr/bin/env python3
"""Generate branded QR codes for floriannedure-psychologue.com"""

import os
import qrcode
from PIL import Image, ImageDraw, ImageFont

URL = "https://floriannedure-psychologue.com/"
OUTPUT_DIR = "img/qrcodes"

# Brand colors
SAGE_GREEN = (123, 142, 123)       # #7B8E7B
SAGE_LIGHT = (168, 181, 160)       # #A8B5A0
BLACK = (30, 30, 30)
GREY_LIGHT = (160, 160, 160)
OFF_WHITE = (253, 252, 251)        # #FDFCFB

# All illustrations to use
ILLUSTRATIONS = [
    ("lotus-flower",        "img/lotus-flower.png"),
    ("hummingbird",         "img/hummingbird.png"),
    ("lotus-on-water",      "img/lotus-on-water.png"),
    ("hands-cradling-lotus","img/hands-cradling-lotus.png"),
    ("hand-holding-lotus",  "img/hand-holding-lotus.png"),
    ("chaos-to-order",      "img/chaos-to-order.png"),
    ("chaos-to-clarity",    "img/chaos-to-clarity.png"),
]

# Color themes
THEMES = {
    "sage": {
        "qr_color": SAGE_GREEN,
        "border_color": SAGE_LIGHT,
        "text_color": SAGE_GREEN,
    },
    "black": {
        "qr_color": BLACK,
        "border_color": GREY_LIGHT,
        "text_color": BLACK,
    },
}


def make_qr(url, box_size=12, border=4):
    """Generate a base QR code with high error correction."""
    qr = qrcode.QRCode(
        version=None,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=box_size,
        border=border,
    )
    qr.add_data(url)
    qr.make(fit=True)
    return qr


def load_font(size=16):
    """Load a nice font with fallback."""
    try:
        return ImageFont.truetype(
            "/usr/share/fonts/truetype/dejavu/DejaVuSans-Light.ttf", size
        )
    except (OSError, IOError):
        return ImageFont.load_default()


def generate_qrcode(image_name, image_path, theme_name, theme):
    """Generate a single QR code with an illustration in the center."""
    qr = make_qr(URL)
    qr_img = qr.make_image(
        fill_color=theme["qr_color"], back_color=OFF_WHITE
    ).convert("RGBA")
    qr_w, qr_h = qr_img.size

    # Load and resize illustration
    logo = Image.open(image_path).convert("RGBA")
    max_logo_size = int(qr_w * 0.24)
    logo.thumbnail((max_logo_size, max_logo_size), Image.LANCZOS)
    logo_w, logo_h = logo.size

    # White circle background with border
    padding = 18
    circle_d = max(logo_w, logo_h) + padding * 2
    circle_img = Image.new("RGBA", (circle_d, circle_d), (0, 0, 0, 0))
    draw = ImageDraw.Draw(circle_img)
    draw.ellipse(
        [0, 0, circle_d - 1, circle_d - 1],
        fill=OFF_WHITE,
        outline=theme["border_color"],
        width=3,
    )

    # Center logo on circle
    circle_img.paste(
        logo,
        ((circle_d - logo_w) // 2, (circle_d - logo_h) // 2),
        logo,
    )

    # Center circle on QR code
    qr_img.paste(
        circle_img,
        ((qr_w - circle_d) // 2, (qr_h - circle_d) // 2),
        circle_img,
    )

    # Outer frame
    frame_padding = 40
    total_w = qr_w + frame_padding * 2
    total_h = qr_h + frame_padding * 2 + 50
    final = Image.new("RGBA", (total_w, total_h), OFF_WHITE)
    final.paste(qr_img, (frame_padding, frame_padding), qr_img)

    draw_final = ImageDraw.Draw(final)
    draw_final.rounded_rectangle(
        [10, 10, total_w - 11, total_h - 11],
        radius=20,
        outline=theme["border_color"],
        width=2,
    )

    # URL text at bottom
    font = load_font(16)
    text = "floriannedure-psychologue.com"
    bbox = draw_final.textbbox((0, 0), text, font=font)
    text_w = bbox[2] - bbox[0]
    text_x = (total_w - text_w) // 2
    text_y = qr_h + frame_padding + 12
    draw_final.text((text_x, text_y), text, fill=theme["text_color"], font=font)

    # Save
    output_path = f"{OUTPUT_DIR}/qrcode-{image_name}-{theme_name}.png"
    final = final.convert("RGB")
    final.save(output_path, "PNG", dpi=(300, 300))
    print(f"  -> {output_path} ({final.size[0]}x{final.size[1]})")


if __name__ == "__main__":
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    total = len(ILLUSTRATIONS) * len(THEMES)
    print(f"Generating {total} QR codes...\n")

    for image_name, image_path in ILLUSTRATIONS:
        for theme_name, theme in THEMES.items():
            generate_qrcode(image_name, image_path, theme_name, theme)

    print(f"\nDone! All files saved to {OUTPUT_DIR}/")
