import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UsersService } from '../users/users.service';
import { TenantsService } from '../tenants/tenants.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tenantsService: TenantsService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('E-mail já está em uso');
    }

    const tenant = await this.tenantsService.create(dto.tenantName, dto.plan);
    const password = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create({
      name: dto.name,
      email: dto.email,
      password,
      tenantId: tenant.id,
      role: 'OWNER',
    });

    return this.issueTokens(user);
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    return this.issueTokens(user);
  }

  async refresh(dto: RefreshTokenDto) {
    const payload = this.jwtService.verify(dto.refreshToken, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET', 'super-secret-refresh-key'),
    }) as { userId: string };

    const user = await this.usersService.findById(payload.userId);
    if (!user?.refreshTokenHash) {
      throw new UnauthorizedException('Sessão expirada');
    }

    const valid = await bcrypt.compare(dto.refreshToken, user.refreshTokenHash);
    if (!valid) {
      throw new UnauthorizedException('Refresh token inválido');
    }

    return this.issueTokens(user);
  }

  async logout(userId: string) {
    await this.usersService.updateRefreshToken(userId, null);
    return { success: true };
  }

  async me(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      tenantId: user.tenantId,
      role: user.role,
      lastLoginAt: user.lastLoginAt,
    };
  }

  private async issueTokens(user: User) {
    const payload = { userId: user.id, email: user.email, tenantId: user.tenantId, role: user.role };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET', 'super-secret-jwt-key'),
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '15m'),
    });
    const refreshToken = this.jwtService.sign({ userId: user.id }, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET', 'super-secret-refresh-key'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
    });

    await this.usersService.updateRefreshToken(user.id, await bcrypt.hash(refreshToken, 10));
    await this.usersService.markLastLogin(user.id);

    return {
      accessToken,
      refreshToken,
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '15m'),
      refreshExpiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
      user: {
        id: user.id,
        email: user.email,
        tenantId: user.tenantId,
        name: user.name,
        role: user.role,
      },
    };
  }
}
