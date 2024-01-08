<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).


# Mes notes

# Todo
Ceci est un projet back-end/front-end, développé en angular pour le front-end et nest.js, prisma, apollo, et graphQl pour le back-end.
La base de donnée est une base postgreSQL qui tourne sur un conteneur docker.

## Début du projet
Au début de ce projet, créer le fichier .env, .gitignore. Enregistrer les information de la base de données sur le .env:
POSTGRES_DB=dbname
POSTGRES_USER=user
POSTGRES_PASSWORD=mypassword

## Créer la base de donnée et s'y connecter avec Prisma
Plusieurs solution sont possible,
- Soit créer la base de donnée en premier et en extraire le schéma, par la suite Prisma va s'occuper puvoir se connecter avec la DB
- Soit éditer directement le schéma avec Prisma et ce dernier va s'occuper de créer la base de donnée

Pour ce projet j'ai choisi d'éditer un schéma directement dans Prisma pour que ce dernier puisse alimenter ma base de donnée.

## Installer et initialiser GraphQL qui va fonctionner avec Prisma
graphQL sera mon interface entre le back-end et le front-end

##### Faire un projet Nest.js
```nest new <nom-du-projet>```

##### Installer le paquet @nestjs/graphql, qui permet d'intégrer GraphQL dans une application Nest.js :
```npm install @nestjs/graphql graphql @nestjs/core @nestjs/common @nestjs/platform-express```























## Instalation de Prisma et initialisation
##### Instalation des dépendances au sein du projet
```npm install prisma @prisma/client```
##### Initialisez le projet Prisma avec la commande suivante et suivre les étapes du guide d'initialisation interactif
```npx prisma init```
Cela génère un fichier prisma et un fichier .env (s'il n'est pas déja présent)
Il faut maintenant adapté la .env avec les informations du compose.yaml afin que Prisma puisse comprendre se connecter à cette DB.
Depuis ce fichier schema.prisma et y mettre un schéma dedans afin que Prisma puisse remplir la DB.

Après avoir défini le schéma, appliquez les modifications à la base de données avec la commande :
```npx prisma db push```

Si une modification doit être effectuée sur la structure de la DB faire cette commande :
```npx prisma migrate dev```

Pour générer le fichier prisma côté client :
```npx prisma generate```