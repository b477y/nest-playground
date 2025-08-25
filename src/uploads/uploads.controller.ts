import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import type { Response } from "express";

@Controller("uploads")
export class UploadsController {
  @Post()
  @UseInterceptors(FileInterceptor("file"))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException("no file provided");
    }

    return { message: "File uploaded successfully", file: file.filename };
  }

  @Post("multiple-files")
  @UseInterceptors(FilesInterceptor("files"))
  uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
    if (!files.length) {
      throw new BadRequestException("no files provided");
    }

    const fileNames = files.map((file) => file.filename);
    return { message: "Files uploaded successfully", files: fileNames };
  }

  @Get(":image")
  showUploadedImage(@Param("image") image: string, @Res() res: Response) {
    return res.sendFile(image, { root: "images" });
  }
}
