import { BadRequestException, Module } from "@nestjs/common";
import { UploadsController } from "./uploads.controller";
import { UploadsService } from "./uploads.service";
import { MulterModule } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { randomUUID } from "crypto";

@Module({
  controllers: [UploadsController],
  providers: [UploadsService],
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: "./images",
        filename(req, file, callback) {
          const prefix = `${randomUUID()}`;
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
export class UploadsModule {}
