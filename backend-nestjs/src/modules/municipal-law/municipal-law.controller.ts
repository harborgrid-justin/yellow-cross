/**
 * MunicipalLaw Controller
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
import { MunicipalLawService } from './municipal-law.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('municipal')
@UseGuards(JwtAuthGuard)
export class MunicipalLawController {
  constructor(private readonly municipallawService: MunicipalLawService) {}

  @Get()
  async findAll() {
    return this.municipallawService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.municipallawService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: any) {
    return this.municipallawService.create(createDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any) {
    return this.municipallawService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.municipallawService.delete(id);
  }
}
