/**
 * FinancialServices Controller
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
import { FinancialServicesService } from './financial-services.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('financial')
@UseGuards(JwtAuthGuard)
export class FinancialServicesController {
  constructor(private readonly financialservicesService: FinancialServicesService) {}

  @Get()
  async findAll() {
    return this.financialservicesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.financialservicesService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: any) {
    return this.financialservicesService.create(createDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any) {
    return this.financialservicesService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.financialservicesService.delete(id);
  }
}
