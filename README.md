# Todo
Ceci est un projet back-end/front-end, développé en angular pour le front-end et nest.js, prisma, apollo, et graphQl pour le back-end.
La base de donnée est une base postgreSQL qui tourne sur un conteneur docker.

## Début du projet
Au début de ce projet, créer le fichier .env, .gitignore. Enregistrer les information de la base de données sur le .env:
POSTGRES_DB=dbname
POSTGRES_USER=user
POSTGRES_PASSWORD=mypassword

## Créer la base de donnée
Plusieurs solution sont possible,
- Soit créer la base de donnée en premier et en extraire le schéma, par la suite Prisma va s'occuper puvoir se connecter avec la DB
- Soit éditer directement le schéma avec Prisma et ce dernier va s'occuper de créer la base de donnée

Pour ce projet j'ai choisi d'éditer un schéma directement dans Prisma pour que ce dernier puisse alimenter ma base de donnée.

###Instalation de Prisma et initialisation
##### Instalation des dépendances au sein du projet
```npm install prisma @prisma/client```
##### Initialisez le projet Prisma avec la commande suivante et suivre les étapes du guide d'initialisation interactif
```npx prisma init```
Cela génère un fichier prisma et un fichier .env (s'il n'est pas déja présent)
Il faut maintenant adapté la .env avec les informations du compose.yaml afin que Prisma puisse comprendre se connecter à cette DB.
Depuis ce fichier schema.prisma et y mettre un schéma dedans afin que Prisma puisse remplir la DB.

Après avoir défini le schéma, appliquez les modifications à la base de données avec la commande :
```npx prisma db push```

