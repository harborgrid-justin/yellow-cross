/**
 * InsuranceDefense Controller
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
import { InsuranceDefenseService } from './insurance-defense.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('insurancedefense')
@UseGuards(JwtAuthGuard)
export class InsuranceDefenseController {
  constructor(private readonly insurancedefenseService: InsuranceDefenseService) {}

  @Get()
  async findAll() {
    return this.insurancedefenseService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.insurancedefenseService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: any) {
    return this.insurancedefenseService.create(createDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any) {
    return this.insurancedefenseService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.insurancedefenseService.delete(id);
  }
}
