import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
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
    });

    return this.issueToken(user.id, user.email, user.tenantId, user.name);
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    return this.issueToken(user.id, user.email, user.tenantId, user.name);
  }

  private issueToken(userId: string, email: string, tenantId: string, name: string) {
    const payload = { userId, email, tenantId };
    return {
      accessToken: this.jwtService.sign(payload),
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '1d'),
      user: { id: userId, email, tenantId, name },
    };
  }
}
