/**
 * MaritimeLaw Controller
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
import { MaritimeLawService } from './maritime-law.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('maritime')
@UseGuards(JwtAuthGuard)
export class MaritimeLawController {
  constructor(private readonly maritimelawService: MaritimeLawService) {}

  @Get()
  async findAll() {
    return this.maritimelawService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.maritimelawService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: any) {
    return this.maritimelawService.create(createDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any) {
    return this.maritimelawService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.maritimelawService.delete(id);
  }
}
