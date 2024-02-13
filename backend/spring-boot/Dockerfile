FROM maven:3.8.7-eclipse-temurin-19 AS build
ADD . /project
WORKDIR /project
RUN mvn clean package -DskipTests

FROM eclipse-temurin:latest
COPY --from=build /project/target/spring-boot-0.0.1-SNAPSHOT.jar /app/coopereats.jar
COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

EXPOSE 8080

ENTRYPOINT ["/wait-for-it.sh", "-t","60","db:5432" , "--", "java", "-jar", "/app/coopereats.jar"]
