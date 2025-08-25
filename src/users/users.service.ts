import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import { AccessTokenType, JWTPayloadType } from "src/utils/types";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserType } from "src/utils/enums";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { join } from "path";
import { unlinkSync } from "fs";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly authService: AuthService
  ) {}

  /**
   * Create new user
   * @param {RegisterDto} registerDto data for creating new user
   * @returns JWT(access token)
   */
  async register(registerDto: RegisterDto): Promise<AccessTokenType> {
    return this.authService.register(registerDto);
  }

  /**
   * Log the user to the web application
   * @param {LoginDto} loginDto data for logging into the system
   * @returns JWT(access token)
   */
  async login(loginDto: LoginDto): Promise<AccessTokenType> {
    return this.authService.login(loginDto);
  }

  async getCurrentUser(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  async getAll() {
    return await this.userRepository.find();
  }

  async updateUserData(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await this.authService.hash(
        updateUserDto.password
      );
    }

    const updatedUser = await this.userRepository.preload({
      id,
      ...updateUserDto,
    });

    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return await this.userRepository.save(updatedUser);
  }

  async deleteUser(payload: JWTPayloadType, id: number) {
    const user = await this.getCurrentUser(payload.id);

    if (user.id !== id && payload.userType !== UserType.ADMIN) {
      throw new ForbiddenException("Access denied you are not allowed");
    }

    await this.userRepository.delete(id);
    return { message: "User deleted successfully" };
  }

  async setProfileImage(userId: number, newProfileImage: string) {
    const user = await this.getCurrentUser(userId);

    if (user.profileImage === null) {
      user.profileImage = newProfileImage;
    } else {
      await this.removeProfileImage(userId);
      user.profileImage = newProfileImage;
    }

    return await this.userRepository.save(user);
  }

  async removeProfileImage(userId: number) {
    const user = await this.getCurrentUser(userId);

    if (user.profileImage === null) {
      throw new NotFoundException("There is no image to delete");
    }

    const imagePath = join(process.cwd(), `images/${user.profileImage}`);
    unlinkSync(imagePath);

    user.profileImage = null!;
    return await this.userRepository.save(user);
  }
}
