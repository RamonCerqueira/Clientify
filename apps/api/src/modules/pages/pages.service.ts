import { Injectable, NotFoundException } from '@nestjs/common';
import slugify from 'slugify';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';

@Injectable()
export class PagesService {
  constructor(private readonly prisma: PrismaService) {}

  private async buildUniqueSlug(value: string) {
    const base = slugify(value, { lower: true, strict: true, trim: true });
    let slug = base;
    let suffix = 1;

    while (await this.prisma.page.findUnique({ where: { slug } })) {
      slug = `${base}-${suffix++}`;
    }

    return slug;
  }

  private suggestTitle(businessType: string) {
    return `Página de captação para ${businessType}`;
  }

  async create(tenantId: string, dto: CreatePageDto) {
    const title = dto.title?.trim() || this.suggestTitle(dto.businessType);
    const slug = await this.buildUniqueSlug(title);

    return this.prisma.page.create({
      data: {
        title,
        slug,
        description: dto.description,
        businessType: dto.businessType,
        whatsapp: dto.whatsapp,
        isPublished: dto.isPublished ?? true,
        tenantId,
      },
    });
  }

  async listByTenant(tenantId: string, pagination: PaginationDto) {
    const page = pagination.page ?? 1;
    const pageSize = pagination.pageSize ?? 20;

    const [items, total] = await Promise.all([
      this.prisma.page.findMany({
        where: { tenantId },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { _count: { select: { leads: true } } },
      }),
      this.prisma.page.count({ where: { tenantId } }),
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

  async getByTenantAndId(tenantId: string, id: string) {
    const page = await this.prisma.page.findFirst({
      where: { id, tenantId },
      include: { _count: { select: { leads: true } } },
    });
    if (!page) throw new NotFoundException('Página não encontrada para este tenant');
    return page;
  }

  async getPublicBySlug(slug: string) {
    const page = await this.prisma.page.findFirst({ where: { slug, isPublished: true } });
    if (!page) throw new NotFoundException('Página não encontrada');
    return page;
  }

  async update(tenantId: string, id: string, dto: UpdatePageDto) {
    const current = await this.ensureTenantOwnership(tenantId, id);
    const title = dto.title?.trim() || current.title;

    return this.prisma.page.update({
      where: { id },
      data: {
        ...dto,
        title,
        slug: dto.title && dto.title !== current.title ? await this.buildUniqueSlug(dto.title) : current.slug,
      },
    });
  }

  async remove(tenantId: string, id: string) {
    await this.ensureTenantOwnership(tenantId, id);
    return this.prisma.page.delete({ where: { id } });
  }

  async ensureTenantOwnership(tenantId: string, id: string) {
    const page = await this.prisma.page.findFirst({ where: { id, tenantId } });
    if (!page) throw new NotFoundException('Página não encontrada para este tenant');
    return page;
  }
}
