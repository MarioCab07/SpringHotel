# Etapa 1: Build con Maven
FROM maven:3.8.6-eclipse-temurin-17 AS builder
WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests

# Etapa 2: Runtime con JRE ligero
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copiamos el jar generado
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080

# Railway pasa el puerto en la variable PORT
ENTRYPOINT ["sh", "-c", "java -jar app.jar --server.port=${PORT}"]
