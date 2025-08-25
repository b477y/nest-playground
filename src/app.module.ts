import {
  ClassSerializerInterceptor,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ProductsModule } from "./products/products.module";
import { ReviewsModule } from "./reviews/reviews.module";
import { UsersModule } from "./users/users.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { UploadsModule } from "./uploads/uploads.module";
import { LoggerMiddleware } from "./utils/middlewares/logger.middleware";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import dataSource, { dataSourceOptions } from "db/data-source";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || "development"}`,
    }),

    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 20,
      },
    ]),

    TypeOrmModule.forRoot(
      dataSourceOptions

      //   {
      //   imports: [ConfigModule],
      //   inject: [ConfigService],
      //   useFactory: (configService: ConfigService) => ({
      //     type: "postgres",
      //     database: configService.get<string>("DB_NAME"),
      //     username: configService.get<string>("DB_USERNAME"),
      //     password: configService.get<string>("DB_PASSWORD"),
      //     host: configService.get<string>("DB_HOST"),
      //     port: configService.get<number>("DB_PORT"),
      //     autoLoadEntities: true,
      //     synchronize: configService.get<string>("NODE_ENV") !== "production",
      //   }),
      // }
    ),

    ProductsModule,
    ReviewsModule,
    UsersModule,
    UploadsModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    AppService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: "*", method: RequestMethod.ALL });
  }
}
