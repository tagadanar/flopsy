# Guide pour modifier le site web

https://tagadanar.github.io/flopsy/

## Table des matières

- [Référence rapide](#référence-rapide)
- [Comment modifier le contenu du site ?](#comment-modifier-le-contenu-du-site-)
- [Comment publier les modifications ?](#comment-publier-les-modifications-)
- [Structure des fichiers](#structure-des-fichiers)
- [Comment modifier les images de fond ?](#comment-modifier-les-images-de-fond-)
- [Comment ajouter ou supprimer une image ?](#comment-ajouter-ou-supprimer-une-image-)
- [Comment tester les modifications sur votre ordinateur ?](#comment-tester-les-modifications-sur-votre-ordinateur-) (avancé)
- [Problèmes fréquents](#problèmes-fréquents)
- [Besoin d'aide ?](#besoin-daide-)

---

## Référence rapide

Les modifications les plus courantes dans `content.json` :

| Je veux modifier... | Section à chercher | Exemple |
|---------------------|-------------------|---------|
| L'adresse du cabinet | `"adresse"` | `"lines": ["86 rue Paul Bert", "69003 Lyon"]` |
| Le lien Doctolib | `"doctolib"` | `"url": "https://www.doctolib.fr/..."` |
| L'email | `"email"` | `"value": "exemple@email.com"` |
| Les horaires | `"horaires"` | `"lines": ["Lundi - Vendredi", "9h - 19h"]` |
| Le texte d'accueil | `"hero"` | `"accroche": "Votre nouveau texte"` |

---

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
| `img/` | Dossier contenant toutes les images de fond |

---

## Comment modifier les images de fond ?

Le site utilise des illustrations en arrière-plan de chaque section. Ces images sont des dessins au trait avec un fond transparent.

### Spécifications recommandées

- **Format** : PNG avec fond transparent
- **Style** : Dessin au trait noir (line art)
- **Dimensions** : Entre 800px et 1500px de large (l'image sera redimensionnée automatiquement)
- **Poids** : Moins de 500 Ko si possible (pour un chargement rapide)

> **Astuce** : Vous pouvez utiliser des outils en ligne comme [remove.bg](https://remove.bg) pour rendre le fond d'une image transparent.

### Liste des images utilisées

Toutes les images se trouvent dans le dossier `img/`.

| Image | Section | Position |
|-------|---------|----------|
| `img/lotus-flower.png` | Accueil | En bas à gauche |
| `img/hummingbird.png` | Accueil | En haut à droite |
| `img/hands-cradling-lotus.png` | À propos | À droite |
| `img/chaos-to-order.png` | Consultations | À gauche |
| `img/chaos-to-clarity.png` | Consultations | À droite |
| `img/hand-holding-lotus.png` | Contact | En bas à gauche |

### Remplacer une image

1. Préparez votre nouvelle image (de préférence un dessin au trait noir sur fond transparent, format PNG)
2. Nommez-la exactement comme l'image que vous voulez remplacer (ex: `hummingbird.png`)
3. Sur GitHub, allez dans le dépôt et ouvrez le dossier **img**
4. Cliquez sur **Add file** > **Upload files**
5. Glissez votre nouvelle image et cliquez sur **Commit changes**

### Modifier la taille ou la position

Les réglages se trouvent dans le fichier `styles.css`. Cherchez le nom de l'image (ex: `hummingbird.png`) pour trouver ses paramètres :

```css
.hero::after {
    background-image: url('img/hummingbird.png');
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
             ↑ top: 10%
             │
    ┌────────┼──────────────────────┐
    │        ▼                      │
    │←5%→┌─────┐                    │
    │    │image│                    │
    │    └─────┘                    │
    │    left: 5%                   │
    │                               │
    │                  ┌─────┐←10%→ │
    │                  │image│      │
    │                  └─────┘      │
    │                      ▲        │
    └──────────────────────┼────────┘
                           │
                    bottom: 15% (↓ 15% du bas)
```

**Options de position :**
- `top: 10%` → à 10% du bord haut
- `bottom: 15%` → à 15% du bord bas
- `left: 5%` → à 5% du bord gauche
- `right: 10%` → à 10% du bord droit

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

## Comment ajouter ou supprimer une image ?

Cette section explique comment ajouter une nouvelle image décorative ou retirer une image existante. Ces opérations nécessitent de modifier le fichier `styles.css`.

### Supprimer une image

Pour retirer une image de fond d'une section :

1. Sur GitHub, ouvrez le fichier `styles.css`
2. Cliquez sur l'icône **crayon** pour modifier
3. Cherchez le nom de l'image que vous voulez supprimer (ex: `hummingbird.png`)
4. Supprimez tout le bloc de code qui contient cette image

**Exemple :** pour supprimer le colibri de la page d'accueil, supprimez ces lignes :

```css
.hero::after {
    background-image: url('img/hummingbird.png');
    width: clamp(360px, 45vw, 720px);
    height: clamp(360px, 45vw, 720px);
    right: 8%;
    top: 0;
}
```

5. Cliquez sur **Commit changes**

> **Note :** L'image restera dans le dossier `img/` mais ne sera plus affichée. Vous pouvez la supprimer manuellement si vous le souhaitez.

### Ajouter une nouvelle image

Pour ajouter une image décorative à une section existante :

**Étape 1 : Téléversez votre image**

1. Préparez votre image (PNG avec fond transparent recommandé)
2. Sur GitHub, ouvrez le dossier **img**
3. Cliquez sur **Add file** > **Upload files**
4. Glissez votre image et cliquez sur **Commit changes**
5. Notez le nom exact de votre fichier (ex: `mon-image.png`)

**Étape 2 : Ajoutez le code CSS**

1. Ouvrez le fichier `styles.css` et cliquez sur le **crayon**
2. Trouvez la section où vous voulez ajouter l'image :
   - `.hero` = Accueil
   - `.apropos` = À propos
   - `.consultations` = Consultations
   - `.contact` = Contact
3. Copiez-collez ce modèle de code juste après le bloc existant de cette section :

```css
.NOM-SECTION::after {
    content: "";
    position: absolute;
    background-image: url('img/mon-image.png');
    background-size: contain;
    background-repeat: no-repeat;
    width: 400px;
    height: 400px;
    right: 10%;
    bottom: 10%;
    opacity: 0.1;
    pointer-events: none;
    z-index: 0;
}
```

4. Remplacez `NOM-SECTION` par le nom de la section (ex: `hero`, `apropos`, `consultations`, `contact`)
5. Remplacez `mon-image.png` par le nom de votre fichier
6. Ajustez la taille, la position et l'opacité selon vos goûts
7. Cliquez sur **Commit changes**

**Utiliser `::before` ou `::after` ?**

Chaque section peut avoir deux images de fond :
- `::before` = première image
- `::after` = deuxième image

Si la section a déjà un `::before`, utilisez `::after` (et vice versa). Si les deux sont pris, il faudra remplacer une image existante.

---

## Comment tester les modifications sur votre ordinateur ?

> **Note :** Cette section est destinée aux utilisateurs avancés. Vous pouvez très bien modifier le site directement sur GitHub sans passer par ces étapes.

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

### Vérifier l'affichage sur mobile

Pour voir à quoi ressemble le site sur un téléphone :
1. Ouvrez le site dans Chrome ou Firefox
2. Appuyez sur **F12** (ou clic droit > "Inspecter")
3. Cliquez sur l'icône de téléphone/tablette en haut à gauche du panneau
4. Choisissez un appareil dans la liste déroulante (ex: "iPhone 12")

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
2. Ouvrez le dossier **img**
3. Cliquez sur **Add file** > **Upload files**
4. Glissez votre nouvelle image (avec le même nom que celle à remplacer)
5. Cliquez sur **Commit changes**

> **Note :** Vous devez être connectée à GitHub et avoir les droits d'accès au dépôt.

---

## Problèmes fréquents

### Mes modifications n'apparaissent pas sur le site

**Solution :** Après avoir cliqué sur "Commit changes", le site met quelques minutes à se mettre à jour (généralement 1 à 3 minutes). Rafraîchissez la page en vidant le cache : **Ctrl+Shift+R** (Windows) ou **Cmd+Shift+R** (Mac).

### La carte ne s'affiche pas au bon endroit

**Cause probable :** Les coordonnées GPS sont incorrectes ou inversées.

**Solution :** Vérifiez que :
- La latitude est en premier (ex: `45.7597`)
- La longitude est en second (ex: `4.8565`)
- Les valeurs utilisent un point (`.`) et non une virgule

### Le site affiche une page blanche ou une erreur

**Cause probable :** Une erreur de syntaxe dans `content.json` (virgule manquante, guillemet oublié, etc.)

**Solution :**
1. Vérifiez que chaque texte est entre guillemets : `"texte"`
2. Vérifiez qu'il y a une virgule après chaque élément (sauf le dernier d'une liste)
3. Utilisez l'historique GitHub pour revenir à une version précédente (voir ci-dessous)

### Comment revenir à une version précédente ?

GitHub garde un historique de toutes les modifications. Pour revenir en arrière :

1. Allez sur [github.com/tagadanar/flopsy](https://github.com/tagadanar/flopsy)
2. Cliquez sur le fichier concerné (ex: `content.json`)
3. Cliquez sur **History** (en haut à droite)
4. Trouvez la version qui fonctionnait et cliquez dessus
5. Cliquez sur les **trois points** (⋯) puis **View file**
6. Copiez le contenu et collez-le dans la version actuelle du fichier

---

## Besoin d'aide ?

### Avant de modifier

Faites une copie de `content.json` avant de le modifier. Comme ça, vous pouvez toujours revenir en arrière facilement.

### Rien n'est perdu

GitHub conserve **toutes les versions** de vos fichiers. Même si vous faites une erreur, vous pouvez toujours retrouver une version précédente (voir "Comment revenir à une version précédente ?" ci-dessus).

### Historique des modifications

Pour voir toutes les modifications passées :
1. Allez sur [github.com/tagadanar/flopsy](https://github.com/tagadanar/flopsy)
2. Cliquez sur **"X commits"** (en haut de la liste des fichiers)
3. Vous verrez la liste de tous les changements avec leur date
