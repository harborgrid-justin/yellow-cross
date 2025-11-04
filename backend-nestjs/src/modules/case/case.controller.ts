/**
 * Case Controller
 * Handles HTTP requests for Case Management
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CaseService } from './case.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { CurrentUser } from '../../decorators/current-user.decorator';

@Controller('cases')
@UseGuards(JwtAuthGuard)
export class CaseController {
  constructor(private readonly caseService: CaseService) {}

  @Get()
  async findAll(@Query('status') status?: string) {
    if (status) {
      return this.caseService.findByStatus(status);
    }
    return this.caseService.findAll({
      where: { archived: false },
      order: [['createdAt', 'DESC']],
    });
  }

  @Get('analytics')
  async getAnalytics() {
    return this.caseService.getCaseAnalytics();
  }

  @Get('my-cases')
  async getMyCases(@CurrentUser() user: any) {
    return this.caseService.findByAssignee(user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.caseService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: any, @CurrentUser() user: any) {
    return this.caseService.create({
      ...createDto,
      createdBy: user.id,
      status: 'Open',
      openedDate: new Date(),
    } as any);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any) {
    return this.caseService.update(id, updateDto);
  }

  @Put(':id/assign')
  async assign(
    @Param('id') id: string,
    @Body() assignDto: { assignedTo: string; reason?: string },
    @CurrentUser() user: any,
  ) {
    return this.caseService.assignCase(
      id,
      assignDto.assignedTo,
      user.id,
      assignDto.reason,
    );
  }

  @Post(':id/notes')
  async addNote(
    @Param('id') id: string,
    @Body() noteDto: { content: string },
    @CurrentUser() user: any,
  ) {
    return this.caseService.addNote(id, noteDto.content, user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.caseService.delete(id);
  }
}
