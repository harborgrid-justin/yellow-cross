/**
 * Bankruptcy Controller
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
import { BankruptcyService } from './bankruptcy.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('bankruptcy')
@UseGuards(JwtAuthGuard)
export class BankruptcyController {
  constructor(private readonly bankruptcyService: BankruptcyService) {}

  @Get()
  async findAll() {
    return this.bankruptcyService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.bankruptcyService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: any) {
    return this.bankruptcyService.create(createDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any) {
    return this.bankruptcyService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.bankruptcyService.delete(id);
  }
}
