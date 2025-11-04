/**
 * Court Controller
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
import { CourtService } from './court.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('court')
@UseGuards(JwtAuthGuard)
export class CourtController {
  constructor(private readonly courtService: CourtService) {}

  @Get()
  async findAll() {
    return this.courtService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.courtService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: any) {
    return this.courtService.create(createDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any) {
    return this.courtService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.courtService.delete(id);
  }
}
