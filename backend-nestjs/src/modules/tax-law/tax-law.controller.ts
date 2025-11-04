/**
 * TaxLaw Controller
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
import { TaxLawService } from './tax-law.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('tax')
@UseGuards(JwtAuthGuard)
export class TaxLawController {
  constructor(private readonly taxlawService: TaxLawService) {}

  @Get()
  async findAll() {
    return this.taxlawService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.taxlawService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: any) {
    return this.taxlawService.create(createDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any) {
    return this.taxlawService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.taxlawService.delete(id);
  }
}
