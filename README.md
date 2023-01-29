# Express test challenge

## Usage

Application provides a simple HTTP interface

POST: `localhost:3000/api/users/update-balance` – Update user balance

GET: `localhost:3000/api/tasks` – Get processing tasks

### Docker

```shell
docker-compose up -d
```

### Local

```shell
docker-compose up -d postgres && \
yarn && yarn start
```

### Development

To run the application in watch mode use `yarn start:dev` command
