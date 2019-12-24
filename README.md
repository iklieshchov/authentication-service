<h1 align="center">NodeJS Authentication Service</h1>


<p align="center">Starter / Example project for user authentication based on NodeJS and MongoDB.</p>


## Table of Contents
- [Getting Started](#getting-started)
- [API](#api)
- [Development Configuration](#development-configuration)
- [Environment Variables](#environment-variables)
- [Build](#build)
- [Test](#test)
- [Links](#links)


## Getting Started

1. To work properly Authentication service requires two pairs of certificates (for access and refresh tokens). Use **./support/gen-certificates.sh** script to generate certificates:\
``cd ./support; ./gen-certificates.sh``
2. Build and run **./docker-compose.yml** configuration:\
``docker-compose build; docker-compose up``
3. Once up and running navigate to ``http://localhost:3000/api-docs/`` to see Swagger documentation.

> NOTE: Authentication Service use cookies to send generated tokens. Due to browser restrictions it is not possible to use Swagger authentication strategies with cookies. To execute protected endpoints run Login endpoint first.


## API

- **[post]** ``/api/user/signup``  - signup new user
- **[post]** ``/api/user/login`` - login user
- **[post]** ``/api/user/refresh`` - refresh access token
- **[post]** ``/api/user/logout`` - logout user
- **[get]** ``/api/user/me`` - information about authenticated user

Use Swagger documentation to see more details: ``http://localhost:3000/api-docs/``.


## Development Configuration

Configuration in **./support/docker-compose.yml** was created to run project in development and supports:
- project restart when source code is changed (using nodemon);
- debugging throught ``9229`` port which is mapped to host machine.


### Environment Variables

| Variable                  | Default Value               | Description                                    |
|---------------------------|-----------------------------|------------------------------------------------|
| ``PORT``                  | 3000                        | http port for service                          |
| ``DB_HOST``               |                             | database host                                  |
| ``DB_PORT``               | 27017                       | database port                                  |
| ``DB_NAME``               |                             | database name                                  |
| ``DB_USER``               |                             | database user if required                      |
| ``DB_PASSWORD``           |                             | database password if required                  |
| ``ACCESS_CERT_PRIVATE``   | /certificates/access.key    | path to private certificate for access token   |
| ``ACCESS_CERT_PUBLIC``    | /certificates/access.pem    | path to public certificate for access token    |
| ``ACCESS_EXPIRES_IN``     | 24h                         | access token expiration time                   |
| ``REFRESH_CERT_PRIVATE``  | /certificates/refresh.key   | path to private certificate for refresh token  |
| ``REFRESH_CERT_PUBLIC``   | /certificates/refresh.pem   | path to public certificate for refresh token   |
| ``REFRESH_EXPIRES_IN``    | 30d                         | refresh token expiration time                  |


## Build

``npm run build``


## Test

Test could be run in two modes:

- ``npm run test`` - single test run;
- ``npm run test:watch`` - watch code and tests and re-run on changes.


## Links
 - [NodeJS](https://nodejs.org/)
 - [MongoDB](https://www.mongodb.com/)
 - [Mongoose](https://mongoosejs.com/)
 - [Awilix](https://github.com/jeffijoe/awilix#readme)
 - [Awilix Express](https://github.com/talyssonoc/awilix-express)
 - [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
 - [nanoid](https://github.com/ai/nanoid)
 - [validator](https://www.npmjs.com/package/validator)
 - [Swagger](https://swagger.io/)
 - [Jest](https://jestjs.io/)
