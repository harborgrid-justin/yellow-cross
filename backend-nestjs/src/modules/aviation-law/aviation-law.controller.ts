/**
 * AviationLaw Controller
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
import { AviationLawService } from './aviation-law.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('aviation')
@UseGuards(JwtAuthGuard)
export class AviationLawController {
  constructor(private readonly aviationlawService: AviationLawService) {}

  @Get()
  async findAll() {
    return this.aviationlawService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.aviationlawService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: any) {
    return this.aviationlawService.create(createDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any) {
    return this.aviationlawService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.aviationlawService.delete(id);
  }
}
