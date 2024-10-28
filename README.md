# Instructions

# State

- **Project unfinished.**
- **Missing tests and testing of all CRUD operations.**
- **Main objectives were targeted and functionality at its core was manually tested.**

---

- The project relies on its backend for the Nest.js framework (Express-based). 
  - Uses a WebSocket implementation for real-time updates on the content collection. 
  - It was implemented following a layered architecture (Repository, Service, Application). 

- The database configuration was done through `Prisma ORM` with an underlying `mongo` database and the Schema is defined within the `prisma` folder. 
  - The Prisma configuration relies heavily on a replica set for MongoDB since it uses Mongo transactions, and replication is required for this configuration. 
  - Therefore, the easiest way to build the solution is through the usage of `docker-compose` which is already configured to manage all of the heavy lifting required to create these instances. 

- The frontend uses the package `socket.io-client` to connect with the backend and its `ws`. 
  - The frontend relies on 3 contexts to share state across the application: `Topics`, `Categories`, and `Auth`. 
  - The frontend was built with the `Vite CLI` and uses `yarn`, and it is configured with `TypeScript + SWC`.


# Setup

## Prerequisites

1. Install Nest.js

    ```sh
    yarn global add @nestjs/cli
    ```

2. Run Docker

    ```sh
    docker-compose up -d
    ```

## Backend Setup

### Run Migrations

#### On Docker

    ```sh
    docker-compose exec backend npx prisma db push
    docker-compose exec backend npx prisma generate
    ```

#### On Local

    ```sh
    npx prisma db push
    npx prisma generate
    ```

### Environment Variables

- `MONGO_DB_URL`: MongoDB connection string.
    ```sh
    MONGO_DB_URL="mongodb://root:root@mongodb-1:27017,mongodb-2:27018,mongodb-3:27019/disruptive-db?authSource=admin&replicaSet=rs0"
    ```
- `JWT_SECRET`: Secret key for JWT.
    ```sh
    JWT_SECRET="1234secret"
    ```
- `MONGO_REPLICA_SET_KEY`: Key for MongoDB replica set.
    ```sh
    MONGO_REPLICA_SET_KEY="OC9BkBHVQdX7evScGPvVJSLQGnHswNOvC7EZMkti5NLFFtFOugGyYi7TFdqu0Jmf
    um7wc3bZZ+lFY2gT3cwxK9MtdMloniplejsk8cbNIMSs0dLjDN5kQ1R5JQswzPYW
    KqK2TrAp1zghf7CrkGpjqnHKEhekPGlLotOnRCSZS2jDvMbEqJBNMnr55wIhGuOe
    8QU2oq+VJ0VnHmq0TIy4muzURDCMCDGa830wURmddho6Yfqepw/3otOWGl8ercy1
    oVadkZsJrdxWq6pZjlWCpaVg65psjBcxXdCn6dMGoHyxDCw3JSPBeYvg1QswigDT
    E/u1QVfXnTyF6mc+ZSnqBaDvAn2zXG79U+GEbNXJDrBVUNozDjSM8v0KL8xHhtiv
    QpNlyeLV5wp7ZUCzbUwU0dnxZWHeYMNIu2lgWOF+4ZSjPWBftJ4ANAkzNq8NYXyP
    kt1V7bD5d9kSU1Qz7brnLG6tawOc5ZimKu8YD/IcyNzR0tBnQ+SHjPT7GipRVUlU
    KDUgscJCnm3XEjvMvdP8YtOVarlQPL3gFMu7nKN+kzyl6QKRBT7M1MXfFkv1oK1U
    /HHa7RD7a0tsNGQFIip3IdZu0f7kuuI2GphtYsj9jmMaeg1zWQjrubv+U1uJee6Y
    uFG45ieXt/b298z5Ca3eIrnB5wS23cEOdjrzkTTmf/SKhpmlXnOlD07p+VgoCbcH
    nyY1iy/jkO02pk1n9oNPqOXiCdVyeldaRoq6BmAOLY3r0yWVxLezaNeG0Q3oGaj3
    O/beaRCtr9bxk2iph5hdrnHcCJ6h/MJSJug264DDBPQJrqJeY+iR0R7Tt2YHFcWL
    QkGgiHRZdYQY8pxlr2Xc7ES20IR/OnaghHJnOcFETmOLVNPtxuipwmBfjD9SZz1/
    jDEQqzqeGOSmv0/f+OIDazvuzKYEi3+bH6vkog4P3ZVSlIG1yv6sEo82tjgTQ+PK
    4OYxaTON3AR7evnoEDmY763sf9XrJ8LrbDTuloGQJAcYTXGX"
    ```

## OpenAPI 

The OpenAPI Swagger Spec is found at the following url: `http://localhost:3000/api`, it is available when the backend server is up and running.

## Frontend Setup

### Environment Variables

- `REACT_APP_API_BASE_URL`: Base URL for the backend API.
    ```sh
    REACT_APP_API_BASE_URL=http://localhost:3000
    ```

### Run Frontend

1. Navigate to the frontend directory.
2. Start the frontend server using Vite.
    ```sh
    yarn vite
    ```

