# Guide pour modifier le site web

https://tagadanar.github.io/flopsy/

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

## Comment modifier les images de fond ?

Le site utilise des illustrations en arrière-plan de chaque section. Ces images sont des dessins au trait avec un fond transparent.

### Liste des images utilisées

| Image | Section | Position |
|-------|---------|----------|
| `lotus-flower.png` | Accueil | En bas à gauche |
| `hummingbird.png` | Accueil | En haut à droite |
| `hands-cradling-lotus.png` | À propos | À droite |
| `chaos-to-order.png` | Consultations | À gauche |
| `chaos-to-clarity.png` | Consultations | À droite |
| `hand-holding-lotus.png` | Contact | En bas à gauche |

### Remplacer une image

1. Préparez votre nouvelle image (de préférence un dessin au trait noir sur fond transparent, format PNG)
2. Nommez-la exactement comme l'image que vous voulez remplacer (ex: `hummingbird.png`)
3. Sur GitHub, allez dans le dépôt et cliquez sur **Add file** > **Upload files**
4. Glissez votre nouvelle image et cliquez sur **Commit changes**

### Modifier la taille ou la position

Les réglages se trouvent dans le fichier `styles.css`. Cherchez le nom de l'image (ex: `hummingbird.png`) pour trouver ses paramètres :

```css
.hero::after {
    background-image: url('hummingbird.png');
    width: clamp(360px, 45vw, 720px);   /* Largeur : minimum, préférée, maximum */
    height: clamp(360px, 45vw, 720px);  /* Hauteur : minimum, préférée, maximum */
    right: 8%;                           /* Distance depuis la droite */
    top: 0;                              /* Distance depuis le haut */
}
```

**Comprendre les valeurs :**
- `width` / `height` : La taille. Le format `clamp(min, préféré, max)` permet à l'image de s'adapter à la taille de l'écran
- `right`, `left` : Distance horizontale (depuis la droite ou la gauche)
- `top`, `bottom` : Distance verticale (depuis le haut ou le bas)
- Les valeurs négatives (ex: `right: -30%`) font dépasser l'image du bord

### Modifier la transparence

Dans `styles.css`, cherchez `opacity` près du nom de l'image :

```css
opacity: 0.1;  /* 0.1 = 10% visible, 0.5 = 50% visible, 1 = 100% visible */
```

---

## Comment tester les modifications sur votre ordinateur ?

Avant de publier des changements, vous pouvez les tester localement. Voici comment faire :

### Étape 1 : Installer Git

**Sur Windows :**
1. Téléchargez Git depuis [git-scm.com](https://git-scm.com/download/win)
2. Lancez l'installateur et cliquez sur "Suivant" à chaque étape (les options par défaut conviennent)

**Sur Mac :**
1. Ouvrez le Terminal (dans Applications > Utilitaires)
2. Tapez `git --version` et appuyez sur Entrée
3. Si Git n'est pas installé, une fenêtre vous proposera de l'installer

### Étape 2 : Télécharger le site sur votre ordinateur

1. Créez un dossier sur votre ordinateur où vous voulez mettre le site (ex: sur le Bureau)
2. Ouvrez un terminal :
   - **Windows** : Clic droit dans le dossier > "Ouvrir dans le terminal" (ou "Git Bash Here")
   - **Mac** : Ouvrez le Terminal et tapez `cd ` puis glissez le dossier dans la fenêtre
3. Tapez cette commande et appuyez sur Entrée :

```bash
git clone https://github.com/tagadanar/flopsy.git
```

4. Un dossier `flopsy` apparaît avec tous les fichiers du site

### Étape 3 : Voir le site en local

1. Allez dans le dossier `flopsy`
2. Double-cliquez sur le fichier `index.html`
3. Le site s'ouvre dans votre navigateur

### Étape 4 : Faire des modifications

1. Modifiez les fichiers avec un éditeur de texte (Bloc-notes, TextEdit, ou [Visual Studio Code](https://code.visualstudio.com/))
2. Sauvegardez le fichier
3. Rafraîchissez la page dans votre navigateur (F5 ou Cmd+R) pour voir le résultat

### Étape 5 : Publier vos modifications (optionnel)

Si vous êtes satisfait de vos changements et souhaitez les publier :

1. Ouvrez un terminal dans le dossier `flopsy`
2. Tapez ces commandes une par une :

```bash
git add .
git commit -m "Description de vos modifications"
git push
```

> **Note :** Pour pouvoir publier, vous devez avoir les droits d'accès au dépôt GitHub.

---

## Besoin d'aide ?

Si vous avez un doute, faites une copie de `content.json` avant de le modifier. Comme ça, vous pouvez toujours revenir en arrière.
