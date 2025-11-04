/**
 * Research Controller
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
import { ResearchService } from './research.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('research')
@UseGuards(JwtAuthGuard)
export class ResearchController {
  constructor(private readonly researchService: ResearchService) {}

  @Get()
  async findAll() {
    return this.researchService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.researchService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: any) {
    return this.researchService.create(createDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any) {
    return this.researchService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.researchService.delete(id);
  }
}
