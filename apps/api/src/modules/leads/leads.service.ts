import { Injectable, NotFoundException } from '@nestjs/common';
import { LeadStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateLeadDto } from './dto/create-lead.dto';

@Injectable()
export class LeadsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateLeadDto) {
    const page = await this.prisma.page.findFirst({ where: { id: dto.pageId, isPublished: true } });
    if (!page) throw new NotFoundException('Página não encontrada');

    return this.prisma.lead.create({
      data: {
        name: dto.name,
        phone: dto.phone,
        message: dto.message,
        source: dto.source ?? 'landing-page',
        pageId: dto.pageId,
      },
    });
  }

  async listByPage(tenantId: string, pageId: string, status?: LeadStatus) {
    const page = await this.prisma.page.findFirst({ where: { id: pageId, tenantId } });
    if (!page) throw new NotFoundException('Página não encontrada para este tenant');

    return this.prisma.lead.findMany({
      where: { pageId, ...(status ? { status } : {}) },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(tenantId: string, leadId: string, status: LeadStatus) {
    const lead = await this.prisma.lead.findFirst({
      where: {
        id: leadId,
        page: { tenantId },
      },
    });

    if (!lead) throw new NotFoundException('Lead não encontrado para este tenant');

    return this.prisma.lead.update({ where: { id: leadId }, data: { status } });
  }
}
