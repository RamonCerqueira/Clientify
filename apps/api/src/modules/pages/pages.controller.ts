import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { RequestUser } from '../../common/interfaces/request-user.interface';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { PagesService } from './pages.service';

@Controller('pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Post()
  create(@CurrentUser() user: RequestUser, @Body() dto: CreatePageDto) {
    return this.pagesService.create(user.tenantId, dto);
  }

  @Get()
  list(@CurrentUser() user: RequestUser) {
    return this.pagesService.listByTenant(user.tenantId);
  }

  @Get('id/:id')
  getById(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    return this.pagesService.getByTenantAndId(user.tenantId, id);
  }

  @Public()
  @Get(':slug')
  getPublicPage(@Param('slug') slug: string) {
    return this.pagesService.getPublicBySlug(slug);
  }

  @Patch(':id')
  update(@CurrentUser() user: RequestUser, @Param('id') id: string, @Body() dto: UpdatePageDto) {
    return this.pagesService.update(user.tenantId, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    return this.pagesService.remove(user.tenantId, id);
  }
}
