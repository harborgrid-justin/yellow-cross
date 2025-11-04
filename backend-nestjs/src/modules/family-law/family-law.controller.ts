/**
 * FamilyLaw Controller
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
import { FamilyLawService } from './family-law.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('family')
@UseGuards(JwtAuthGuard)
export class FamilyLawController {
  constructor(private readonly familylawService: FamilyLawService) {}

  @Get()
  async findAll() {
    return this.familylawService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.familylawService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: any) {
    return this.familylawService.create(createDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any) {
    return this.familylawService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.familylawService.delete(id);
  }
}
