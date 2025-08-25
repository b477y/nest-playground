import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import helmet from "helmet";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })
  );

  // Apply Middlewares
  app.use(helmet());

  // CORS Policy
  app.enableCors();

  // Global Prefix
  app.setGlobalPrefix("api");

  const swagger = new DocumentBuilder()
    .setTitle("nest-playground")
    .setDescription("Just started")
    .setVersion("1.0")
    .addSecurity("bearer", { type: "http", scheme: "bearer" })
    .addBearerAuth()
    .build();
  const documentation = SwaggerModule.createDocument(app, swagger);
  // http://localhost:3000/swagger
  SwaggerModule.setup("swagger", app, documentation);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
