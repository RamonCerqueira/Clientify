import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { PagesService } from './pages.service';

@Controller('pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Post()
  create(@CurrentUser() user: { tenantId: string }, @Body() dto: CreatePageDto) {
    return this.pagesService.create(user.tenantId, dto);
  }

  @Get()
  list(@CurrentUser() user: { tenantId: string }) {
    return this.pagesService.listByTenant(user.tenantId);
  }

  @Public()
  @Get(':slug')
  getPublicPage(@Param('slug') slug: string) {
    return this.pagesService.getPublicBySlug(slug);
  }

  @Patch(':id')
  update(@CurrentUser() user: { tenantId: string }, @Param('id') id: string, @Body() dto: UpdatePageDto) {
    return this.pagesService.update(user.tenantId, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: { tenantId: string }, @Param('id') id: string) {
    return this.pagesService.remove(user.tenantId, id);
  }
}
