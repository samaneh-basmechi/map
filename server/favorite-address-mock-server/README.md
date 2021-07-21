# Favorite Address Mock Server

It's a simple mock server with ability for authentication. [JSON Server](https://github.com/typicode/json-server) and [JSON Server Auth](https://github.com/jeremyben/json-server-auth) are used for creating this mock server.


### Resources

- `/public-addresses`: CRUD for address entities publicly available. Any user without authentication can access them. These resources could be used for Milestone 1.
- `/login` and `/register`: Authentication endpoints
- `/users`: View and edit profile endpoints
- `/favorite-addresses`: CRUD for favorite address entities, in which each entity has a user as owner


### Run Mock Server

- Install packages

    ```bash
    npm install
    ```

- Start the server

    ```bash
    npm start
    ```


### Postman Collection

You can import the provided collection in Postman to try the endpoints.
