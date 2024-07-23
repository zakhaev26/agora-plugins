import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { jwtConstants } from './constants/jwt-constants';
import { IS_PUBLIC_KEY } from './decorators/public.decorator';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {
    console.log('[PASSING-THROUGH]: GLOBAL APP_GUARD -> AuthGuard..!');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    console.log('auth-guard');
    if (isPublic) {
      // 💡 See this condition
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.#extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });

      const user = await this.usersService.findOne(payload.user._id);

      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      if (user) {
        request['user'] = user;
        return true;
      }
    } catch {
      throw new UnauthorizedException();
    }
    throw new UnauthorizedException();
  }

  #extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
