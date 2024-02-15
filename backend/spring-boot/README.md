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

# GitHub Commands

- Check branch: `git branch`
- Create a new branch: `git checkout -b <branch_name>`
- After coding:
    - `git add <relevant files>`
    - `git commit -m "<some message>"`
    - `git push`
- To move between branches: `git checkout <existing_branch_name>`
- Pull changes from branch: `git pull`
- Check changed files: `git status`

If you run into authentication problems when pushing/committing, follow this link to create a personal access token to use as a password: [Managing your personal access tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens).
