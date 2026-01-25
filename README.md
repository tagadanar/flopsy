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
    width: clamp(360px, 45vw, 720px);   /* Largeur */
    height: clamp(360px, 45vw, 720px);  /* Hauteur */
    right: 8%;                           /* Distance depuis la droite */
    top: 0;                              /* Distance depuis le haut */
}
```

### Comprendre les unités de mesure

| Unité | Signification | Exemple |
|-------|---------------|---------|
| `px` | Pixels - taille fixe | `200px` = toujours 200 pixels |
| `%` | Pourcentage de la section parente | `50%` = moitié de la largeur de la section |
| `vw` | Pourcentage de la largeur de l'écran | `45vw` = 45% de la largeur de l'écran |

**Exemples concrets :**
- Sur un écran de 1000px de large : `45vw` = 450px
- Sur un téléphone de 400px de large : `45vw` = 180px
- `50%` dans une section = moitié de cette section

### Comprendre `clamp(minimum, idéal, maximum)`

La fonction `clamp()` permet à l'image de s'adapter à la taille de l'écran tout en restant dans des limites :

```css
width: clamp(360px, 45vw, 720px);
```

Cela signifie :
- **Minimum** : jamais plus petit que 360px
- **Idéal** : essaie d'être à 45% de la largeur de l'écran
- **Maximum** : jamais plus grand que 720px

| Taille écran | Calcul 45vw | Résultat final |
|--------------|-------------|----------------|
| Téléphone (400px) | 180px | **360px** (minimum appliqué) |
| Tablette (900px) | 405px | **405px** (valeur idéale) |
| Grand écran (2000px) | 900px | **720px** (maximum appliqué) |

**Astuce :** Pour une taille fixe (qui ne change pas), utilisez simplement des pixels :
```css
width: 400px;
height: 400px;
```

### Comprendre la position

L'image est placée par rapport aux bords de sa section :

```
┌─────────────────────────────────┐
│  top: 0                         │
│  ┌─────┐                        │
│  │image│                        │
│  └─────┘                        │
│  left: 5%                       │
│                                 │
│                    right: 10%   │
│                    ┌─────┐      │
│                    │image│      │
│                    └─────┘      │
│                    bottom: 15%  │
└─────────────────────────────────┘
```

**Options de position :**
- `top: 0` → collée en haut
- `bottom: 15%` → à 15% du bas
- `left: 5%` → à 5% de la gauche
- `right: 10%` → à 10% de la droite

**Valeurs négatives = dépasse du bord :**
- `right: -30%` → l'image dépasse de 30% sur la droite (partiellement cachée)
- `left: -50px` → l'image dépasse de 50px sur la gauche

### Modifier la transparence

Dans `styles.css`, cherchez `opacity` près du nom de l'image :

```css
opacity: 0.1;   /* 10% visible - très transparent */
opacity: 0.3;   /* 30% visible - assez transparent */
opacity: 0.5;   /* 50% visible - semi-transparent */
opacity: 1;     /* 100% visible - opaque */
```

**Valeurs actuelles du site :**
- Accueil (hero) : `0.1` (10%)
- À propos : `0.08` (8%)
- Consultations : `0.12` (12%)
- Contact : `0.08` (8%)

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
4. Répétez jusqu'à ce que vous soyez satisfaite du résultat

### Étape 5 : Publier vos modifications

Une fois vos tests terminés, publiez vos changements via le site GitHub (c'est plus simple que la ligne de commande) :

**Pour un fichier texte (comme `styles.css` ou `content.json`) :**
1. Allez sur [github.com/tagadanar/flopsy](https://github.com/tagadanar/flopsy)
2. Cliquez sur le fichier que vous avez modifié
3. Cliquez sur l'icône **crayon** (en haut à droite)
4. Sélectionnez tout (Ctrl+A ou Cmd+A), puis collez le contenu de votre fichier local
5. Cliquez sur **Commit changes**

**Pour une image :**
1. Allez sur [github.com/tagadanar/flopsy](https://github.com/tagadanar/flopsy)
2. Cliquez sur **Add file** > **Upload files**
3. Glissez votre nouvelle image (avec le même nom que celle à remplacer)
4. Cliquez sur **Commit changes**

> **Note :** Vous devez être connectée à GitHub et avoir les droits d'accès au dépôt.

---

## Besoin d'aide ?

Si vous avez un doute, faites une copie de `content.json` avant de le modifier. Comme ça, vous pouvez toujours revenir en arrière.
