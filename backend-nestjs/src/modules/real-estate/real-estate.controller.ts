/**
 * RealEstate Controller
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
import { RealEstateService } from './real-estate.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('realestate')
@UseGuards(JwtAuthGuard)
export class RealEstateController {
  constructor(private readonly realestateService: RealEstateService) {}

  @Get()
  async findAll() {
    return this.realestateService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.realestateService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: any) {
    return this.realestateService.create(createDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any) {
    return this.realestateService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.realestateService.delete(id);
  }
}
