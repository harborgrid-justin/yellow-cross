/**
 * HealthcareLaw Controller
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
import { HealthcareLawService } from './healthcare-law.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('healthcare')
@UseGuards(JwtAuthGuard)
export class HealthcareLawController {
  constructor(private readonly healthcarelawService: HealthcareLawService) {}

  @Get()
  async findAll() {
    return this.healthcarelawService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.healthcarelawService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: any) {
    return this.healthcarelawService.create(createDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any) {
    return this.healthcarelawService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.healthcarelawService.delete(id);
  }
}
