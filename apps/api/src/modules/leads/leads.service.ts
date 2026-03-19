import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateLeadDto } from './dto/create-lead.dto';

@Injectable()
export class LeadsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateLeadDto) {
    const page = await this.prisma.page.findUnique({ where: { id: dto.pageId } });
    if (!page) throw new NotFoundException('Página não encontrada');

    return this.prisma.lead.create({
      data: {
        name: dto.name,
        phone: dto.phone,
        message: dto.message,
        pageId: dto.pageId,
      },
    });
  }

  // Mesmo que o lead não tenha tenantId direto, a leitura sempre passa pela página do tenant.
  async listByPage(tenantId: string, pageId: string) {
    const page = await this.prisma.page.findFirst({ where: { id: pageId, tenantId } });
    if (!page) throw new NotFoundException('Página não encontrada para este tenant');

    return this.prisma.lead.findMany({
      where: { pageId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
