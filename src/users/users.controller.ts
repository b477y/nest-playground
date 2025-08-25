import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { AuthGuard } from "./guards/auth.guard";
import { CurrentUser } from "./decorators/current-user.decorator";
import { Roles } from "./decorators/user.role.decorator";
import { UserType } from "src/utils/enums";
import { AuthRolesGuard } from "./guards/auth-roles.guard";
import { UpdateUserDto } from "./dto/update-user.dto";
import type { JWTPayloadType } from "src/utils/types";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { randomUUID } from "crypto";
import type { Response } from "express";
import { ApiBody, ApiConsumes, ApiSecurity } from "@nestjs/swagger";
import { ImageUploadDto } from "./dto/image-upload.dto";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("auth/register")
  register(@Body() registerDto: RegisterDto) {
    return this.usersService.register(registerDto);
  }

  @Post("auth/login")
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto) {
    return this.usersService.login(loginDto);
  }

  @Get("current-user")
  @UseGuards(AuthGuard)
  getCurrentUser(@CurrentUser("id") id: number) {
    return this.usersService.getCurrentUser(id);
  }

  @Get()
  @Roles(UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  getAll() {
    return this.usersService.getAll();
  }

  @Patch("update")
  @Roles(UserType.ADMIN, UserType.NORMAL_USER)
  @UseGuards(AuthRolesGuard)
  updateUserData(
    @CurrentUser("id") id: number,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.usersService.updateUserData(id, updateUserDto);
  }

  @Delete(":id")
  @Roles(UserType.ADMIN, UserType.NORMAL_USER)
  @UseGuards(AuthRolesGuard)
  deleteUser(
    @CurrentUser() payload: JWTPayloadType,
    @Param("id", ParseIntPipe) id: number
  ) {
    return this.usersService.deleteUser(payload, id);
  }

  @Post("profile-image")
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor("file"))
  @ApiConsumes("multipart/form-data")
  @ApiBody({ type: ImageUploadDto, description: "profile-image" })
  @ApiSecurity('bearer')
  uploadProfileImage(
    @CurrentUser("id", ParseIntPipe) userId: number,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (!file) {
      throw new BadRequestException("no file provided");
    }

    const newProfileImage = file.filename;
    return this.usersService.setProfileImage(userId, newProfileImage);
  }

  @Get("images/:image")
  showUploadedImage(@Param("image") image: string, @Res() res: Response) {
    return res.sendFile(image, { root: "images" });
  }

  @Delete("images/profile-image")
  @UseGuards(AuthGuard)
  removeProfileImage(@CurrentUser("id", ParseIntPipe) userId: number) {
    return this.usersService.removeProfileImage(userId);
  }
}
