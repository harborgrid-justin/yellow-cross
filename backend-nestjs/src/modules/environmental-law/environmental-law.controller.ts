/**
 * EnvironmentalLaw Controller
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
import { EnvironmentalLawService } from './environmental-law.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('environmental')
@UseGuards(JwtAuthGuard)
export class EnvironmentalLawController {
  constructor(private readonly environmentallawService: EnvironmentalLawService) {}

  @Get()
  async findAll() {
    return this.environmentallawService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.environmentallawService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: any) {
    return this.environmentallawService.create(createDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any) {
    return this.environmentallawService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.environmentallawService.delete(id);
  }
}
