import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { LeadStatus } from '@prisma/client';
import { Throttle } from '@nestjs/throttler';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
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
    @Param('pageId') pageId: string,
    @Query('status') status?: LeadStatus,
  ) {
    return this.leadsService.listByPage(user.tenantId, pageId, status);
  }

  @Patch(':leadId/status')
  updateStatus(
    @CurrentUser() user: RequestUser,
    @Param('leadId') leadId: string,
    @Body() dto: UpdateLeadStatusDto,
  ) {
    return this.leadsService.updateStatus(user.tenantId, leadId, dto.status);
  }
}
