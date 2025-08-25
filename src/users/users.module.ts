import { BadRequestException, Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { User } from "./user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthService } from "./auth.service";
import { MulterModule } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { randomUUID } from "crypto";

@Module({
  controllers: [UsersController],
  providers: [UsersService, AuthService],
  exports: [UsersService],
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
        signOptions: { expiresIn: configService.get<string>("JWT_EXPIRES_IN") },
      }),
    }),
    MulterModule.register({
      storage: diskStorage({
        destination: "./images",
        filename(req, file, callback) {
          const prefix = randomUUID();
          const filename = `${prefix}-${file.originalname}`;
          callback(null, filename);
        },
      }),
      fileFilter(req, file, callback) {
        if (file.mimetype.startsWith("image")) {
          callback(null, true);
        } else {
          callback(new BadRequestException("Unsupported file format"), false);
        }
      },
    }),
  ],
})
export class UsersModule {}
