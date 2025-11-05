# Etapa 1: compilamos tu aplicación con Maven
FROM maven:3.8.6-eclipse-temurin-17 AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Etapa 2: construimos la imagen de ejecución
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copiamos el JAR ya compilado
COPY --from=builder /app/target/*.jar app.jar

# (Opcional) Si quieres proveer un application.yml externo
# para no bakear credenciales en la imagen, puedes copiarlo aquí:
# COPY application.yml ./config/

# Exponemos el puerto (ajusta si es otro)
EXPOSE 8080

# Variables de entorno por defecto (puedes omitir o sobreescribirlas)
# ENV SPRING_DATASOURCE_URL=jdbc:postgresql://turntable.proxy.rlwy.net:43537/railway?sslmode=require
# ENV SPRING_DATASOURCE_USERNAME=postgres
# ENV SPRING_DATASOURCE_PASSWORD=sEgQacAISsbTsDbwfAVgHbsyvCwOCXwo
# ENV APP_JWT_SECRET=63a3101ac990aa2382bc6233189c036035fff09b46f0e18834614273e252debd
# ENV APP_JWT_EXPIRATION_TIME=86400000
# ENV ADMIN_FULLNAME="Admin User"
# ENV ADMIN_COUNTRY=AD
# ENV ADMIN_DOCUMENTNUMBER=123456778-9
# ENV ADMIN_PHONENUMBER=12345678
# ENV ADMIN_EMAIL=admin@hotel.com
# ENV ADMIN_USERNAME=adminUser
# ENV ADMIN_PASSWORD=49SuF7B9Wtzd

# Indica a Spring Boot que ademas de la application.yml embebida,
# lea /app/config/application.yml si existe.
# ENV SPRING_CONFIG_ADDITIONAL_LOCATION=optional:file:./config/

# Comando de arranque
ENTRYPOINT ["java","-jar","/app/app.jar"]
