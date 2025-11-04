/**
 * DataPrivacy Controller
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
import { DataPrivacyService } from './data-privacy.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('privacy')
@UseGuards(JwtAuthGuard)
export class DataPrivacyController {
  constructor(private readonly dataprivacyService: DataPrivacyService) {}

  @Get()
  async findAll() {
    return this.dataprivacyService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.dataprivacyService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: any) {
    return this.dataprivacyService.create(createDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any) {
    return this.dataprivacyService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.dataprivacyService.delete(id);
  }
}
