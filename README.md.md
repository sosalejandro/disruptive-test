# Instructions

# Setup

1. Install Nest.js

```sh
yarn global add @nestjs/cli
```

2. Run Docker

```sh
docker-compose up -d
```

3. Run Migrations

## On Docker
```sh
docker-compose exec backend npx prisma db push
docker-compose exec backend npx prisma generate
```

## On Local

```sh
npx prisma db push
npx prisma generate
```
