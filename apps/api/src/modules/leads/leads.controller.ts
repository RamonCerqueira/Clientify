import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { LeadStatus } from '@prisma/client';
import { Throttle } from '@nestjs/throttler';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { RequestUser } from '../../common/interfaces/request-user.interface';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadStatusDto } from './dto/update-lead-status.dto';
import { LeadsService } from './leads.service';

@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post()
  create(@Body() dto: CreateLeadDto) {
    return this.leadsService.create(dto);
  }

  @Get('page/:pageId')
  listByPage(
    @CurrentUser() user: RequestUser,
    @Param('pageId', new ParseUUIDPipe()) pageId: string,
    @Query('status') status?: LeadStatus,
    @Query() pagination?: PaginationDto,
  ) {
    return this.leadsService.listByPage(user.tenantId, pageId, status, pagination);
  }

  @Patch(':leadId/status')
  updateStatus(
    @CurrentUser() user: RequestUser,
    @Param('leadId', new ParseUUIDPipe()) leadId: string,
    @Body() dto: UpdateLeadStatusDto,
  ) {
    return this.leadsService.updateStatus(user.tenantId, leadId, dto.status);
  }
}
