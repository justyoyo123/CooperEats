# How to Start up Spring Boot Application Locally
**I recommend using this method for general testing since it loads faster than the docker compose method**

Use this command to create a local docker container running Postgres:

`docker run --rm --name lil-postgres -e POSTGRES_PASSWORD=dbpassword -d -v $HOME/srv/postgres:/var/lib/postgresql/data -p 5432:5432 postgres`


Then, in the `application.properties` file inside the `CooperEats/backend/spring-boot/src/main/resources` directory, ensure the two lines for `datasource.url` and `datasource.password` under the "FOR LOCAL" comment are uncommented. Comment out the two lines under the "FOR DOCKER COMPOSE" comment if they are not already commented.

Next, inside the `CooperEats/backend/spring-boot` directory, run:

`mvn spring-boot:run`


When done setting up, you can use Postman/python scripts to send HTTP requests at these URLs:

- User-related: `http://localhost:8080/api/users`
- Order-related: `http://localhost:8080/api/orders`
- Cart-related: `http://localhost:8080/api/carts`
- Payment info related: `http://localhost:8080/api/payments`

# How to Start up Spring Boot Application Using Docker Compose

**Make sure no local docker container is running on port 5432 before proceeding.**

In the `application.properties` file at `CooperEats/backend/spring-boot/src/main/resources`, ensure the two lines under "FOR DOCKER COMPOSE" are uncommented and the two lines under "FOR LOCAL" are commented.

From the `CooperEats/backend/spring-boot` directory, run:

`docker-compose up --build`


**Note:** Sometimes, the database docker container takes longer to start up than the application, which can cause problems. If this still happens with the 120-second wait time, inside `CooperEats/backend/spring-boot/Dockerfile`, change the '120' to a larger time like '180' inside the last line of Dockerfile.

To take down Docker compose, run `docker compose down`.

After setup, you can use Postman/python scripts to send HTTP requests at these URLs:

- User-related: `http://localhost:8080/api/users`
- Order-related: `http://localhost:8080/api/orders`
- Cart-related: `http://localhost:8080/api/carts`
- Payment info related: `http://localhost:8080/api/payments`


# General Info
If you want to persist the database information meaning even if you close the application, you want the old data to be there when you boot it back up, change inside `application.properties` the `spring.jpa.hibernate.ddl-auto` line to `update`. If you want to reset the database every time you boot up the application, change it to `create`.