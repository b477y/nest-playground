import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { AccessTokenType, JWTPayloadType } from 'src/utils/types';
import * as argon2 from 'argon2';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Create new user
   * @param {RegisterDto} registerDto data for creating new user
   * @returns JWT(access token)
   */
  async register(registerDto: RegisterDto): Promise<AccessTokenType> {
    await this.ensureEmailIsAvailable(registerDto.email);

    registerDto.password = await this.hash(registerDto.password);
    const user = this.userRepository.create(registerDto);
    await this.userRepository.save(user);
    const payload: JWTPayloadType = { id: user.id, userType: user.userType };

    return await this.generateJWT(payload);
  }

  /**
   * Log the user to the web application
   * @param {LoginDto} loginDto data for logging into the system
   * @returns JWT(access token)
   */
  async login(loginDto: LoginDto): Promise<AccessTokenType> {
    const user = await this.userRepository.findOneBy({ email: loginDto.email });

    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }

    const isCorrect = await argon2.verify(user.password, loginDto.password);

    if (!isCorrect) {
      throw new BadRequestException('Invalid email or password');
    }
    const payload: JWTPayloadType = { id: user.id, userType: user.userType };

    return await this.generateJWT(payload);
  }

  async hash(plaintext: string): Promise<string> {
    const argon2Options = {
      type: argon2.argon2id,
      memoryCost:
        this.configService.get<number>('ARGON2_MEMORY_COST') ?? 2 ** 16,
      timeCost: this.configService.get<number>('ARGON2_TIME_COST') ?? 3,
      parallelism: this.configService.get<number>('ARGON2_PARALLELISM') ?? 1,
    };

    return await argon2.hash(plaintext, argon2Options);
  }

  async generateJWT(payload: JWTPayloadType): Promise<AccessTokenType> {
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken };
  }

  /**
   * Return a boolean that respresents if the user exists by email or not
   * @param email
   * @returns {Promise<boolean>}
   */
  async doesUserExistByEmail(email: string): Promise<boolean> {
    return await this.userRepository.existsBy({ email });
  }

  /**
   * Throw an error if the email is already exist(will be used in the registeration service)
   * @param email
   * @returns {Promise<void>}
   */
  async ensureEmailIsAvailable(email: string): Promise<void> {
    const exists = await this.doesUserExistByEmail(email);
    if (exists) {
      throw new BadRequestException('Email is already registered');
    }
  }
}
