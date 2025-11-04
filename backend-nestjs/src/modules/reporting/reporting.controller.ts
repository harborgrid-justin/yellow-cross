/**
 * Reporting Controller
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ReportingService } from './reporting.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportingController {
  constructor(private readonly reportingService: ReportingService) {}

  @Get()
  async findAll() {
    return this.reportingService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.reportingService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: any) {
    return this.reportingService.create(createDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any) {
    return this.reportingService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.reportingService.delete(id);
  }
}
