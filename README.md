# Guide pour modifier le site web

## Comment modifier le contenu du site ?

Tout le texte du site se trouve dans un seul fichier : **`content.json`**

### Ce que vous pouvez modifier :

| Section | Ce que ça change |
|---------|------------------|
| `hero` | Votre nom, titre et phrase d'accroche sur la page d'accueil |
| `apropos` | Le texte "À propos" et votre parcours |
| `consultations` | Les cartes décrivant vos consultations |
| `contact` | Adresse, horaires, email, lien Doctolib |
| `footer` | Le copyright et numéro ADELI |

### Exemple : changer l'adresse du cabinet

Dans le fichier `content.json`, trouvez cette partie :

```json
"adresse": {
  "label": "Adresse du cabinet",
  "lines": ["86 rue Paul Bert", "69003 Lyon"],
  "latitude": 45.7597,
  "longitude": 4.8565
}
```

Modifiez les lignes d'adresse et les coordonnées GPS. La carte se mettra à jour automatiquement.

> Pour trouver les coordonnées GPS d'une adresse : allez sur [Google Maps](https://maps.google.com), faites un clic droit sur l'adresse, les coordonnées apparaissent (latitude, longitude).

### Exemple : changer le lien Doctolib

```json
"doctolib": {
  "text": "Prendre rendez-vous sur Doctolib",
  "url": "https://www.doctolib.fr/psychologue/lyon/florianne-dure"
}
```

---

## Comment publier les modifications ?

1. Allez sur GitHub et ouvrez le fichier `content.json`
2. Cliquez sur l'icône **crayon** (en haut à droite du fichier) pour modifier
3. Faites vos modifications directement dans l'éditeur
4. En bas de la page, cliquez sur le bouton vert **"Commit changes"**
5. **Attendez quelques minutes** : le site se met à jour automatiquement

---

## Structure des fichiers

| Fichier | Rôle |
|---------|------|
| `content.json` | Tout le texte modifiable |
| `index.html` | Structure de la page (ne pas toucher) |
| `styles.css` | Apparence visuelle (ne pas toucher) |
| `script.js` | Fonctionnement (ne pas toucher) |

---

## Besoin d'aide ?

Si vous avez un doute, faites une copie de `content.json` avant de le modifier. Comme ça, vous pouvez toujours revenir en arrière.
