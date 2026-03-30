import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService, private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', 'super-secret-jwt-key'),
    });
  }

  async validate(payload: { userId: string; tenantId: string; email: string; role: 'OWNER' | 'ADMIN' | 'MEMBER' }) {
    const user = await this.usersService.findById(payload.userId);
    if (!user || user.tenantId !== payload.tenantId) {
      throw new UnauthorizedException('Sessão inválida');
    }

    return payload;
  }
}
