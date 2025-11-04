/**
 * SecuritiesLaw Controller
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
import { SecuritiesLawService } from './securities-law.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('securities')
@UseGuards(JwtAuthGuard)
export class SecuritiesLawController {
  constructor(private readonly securitieslawService: SecuritiesLawService) {}

  @Get()
  async findAll() {
    return this.securitieslawService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.securitieslawService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: any) {
    return this.securitieslawService.create(createDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any) {
    return this.securitieslawService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.securitieslawService.delete(id);
  }
}
