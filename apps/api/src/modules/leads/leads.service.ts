import { Injectable, NotFoundException } from '@nestjs/common';
import { LeadStatus } from '@prisma/client';
import { PaginationDto } from '../../common/dto/pagination.dto';
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

  async listByPage(tenantId: string, pageId: string, status?: LeadStatus, pagination?: PaginationDto) {
    const pageOwner = await this.prisma.page.findFirst({ where: { id: pageId, tenantId } });
    if (!pageOwner) throw new NotFoundException('Página não encontrada para este tenant');

    const page = pagination?.page ?? 1;
    const pageSize = pagination?.pageSize ?? 20;

    const [items, total] = await Promise.all([
      this.prisma.lead.findMany({
        where: { pageId, ...(status ? { status } : {}) },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.lead.count({ where: { pageId, ...(status ? { status } : {}) } }),
    ]);

    return {
      items,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
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
