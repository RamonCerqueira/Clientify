import { Injectable } from '@nestjs/common';
import { Plan, Tenant } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TenantsService {
  constructor(private readonly prisma: PrismaService) {}

  create(name: string, plan: Plan = Plan.BASIC): Promise<Tenant> {
    return this.prisma.tenant.create({
      data: { name, plan },
    });
  }
}
