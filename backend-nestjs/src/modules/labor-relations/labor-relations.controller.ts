/**
 * LaborRelations Controller
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
import { LaborRelationsService } from './labor-relations.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('labor')
@UseGuards(JwtAuthGuard)
export class LaborRelationsController {
  constructor(private readonly laborrelationsService: LaborRelationsService) {}

  @Get()
  async findAll() {
    return this.laborrelationsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.laborrelationsService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: any) {
    return this.laborrelationsService.create(createDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any) {
    return this.laborrelationsService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.laborrelationsService.delete(id);
  }
}
