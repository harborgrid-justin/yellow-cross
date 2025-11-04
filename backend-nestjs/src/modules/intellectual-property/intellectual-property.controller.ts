/**
 * IntellectualProperty Controller
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
import { IntellectualPropertyService } from './intellectual-property.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('ip')
@UseGuards(JwtAuthGuard)
export class IntellectualPropertyController {
  constructor(private readonly intellectualpropertyService: IntellectualPropertyService) {}

  @Get()
  async findAll() {
    return this.intellectualpropertyService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.intellectualpropertyService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: any) {
    return this.intellectualpropertyService.create(createDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any) {
    return this.intellectualpropertyService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.intellectualpropertyService.delete(id);
  }
}
