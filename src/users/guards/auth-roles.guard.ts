import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserType } from 'src/utils/enums';
import { UsersService } from '../users.service';
import { CURRENT_USER } from 'src/utils/constants';
import { JWTPayloadType } from 'src/utils/types';

@Injectable()
export class AuthRolesGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles: UserType[] = this.reflector.getAllAndOverride('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles?.length) return false;

    const request: Request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader)
      throw new UnauthorizedException('Authorization header missing');

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token)
      throw new UnauthorizedException('Invalid token format');

    let payload: JWTPayloadType;
    try {
      payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    if (!roles.includes(payload.userType))
      throw new ForbiddenException('Insufficient role');

    request[CURRENT_USER] = payload;

    const user = await this.userService.getCurrentUser(payload.id);

    if (!roles.includes(user.userType))
      throw new ForbiddenException('Insufficient role');

    return true;
  }
}
