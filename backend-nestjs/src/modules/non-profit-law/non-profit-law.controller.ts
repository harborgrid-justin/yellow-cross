/**
 * NonProfitLaw Controller
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
import { NonProfitLawService } from './non-profit-law.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('nonprofit')
@UseGuards(JwtAuthGuard)
export class NonProfitLawController {
  constructor(private readonly nonprofitlawService: NonProfitLawService) {}

  @Get()
  async findAll() {
    return this.nonprofitlawService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.nonprofitlawService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: any) {
    return this.nonprofitlawService.create(createDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any) {
    return this.nonprofitlawService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.nonprofitlawService.delete(id);
  }
}
