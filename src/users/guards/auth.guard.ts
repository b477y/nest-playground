import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { CURRENT_USER } from 'src/utils/constants';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader)
      throw new UnauthorizedException('Authorization header missing');

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token)
      throw new UnauthorizedException('Invalid token format');

    try {
      request[CURRENT_USER] = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
