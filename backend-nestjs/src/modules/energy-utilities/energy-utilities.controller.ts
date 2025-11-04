/**
 * EnergyUtilities Controller
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
import { EnergyUtilitiesService } from './energy-utilities.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('energy')
@UseGuards(JwtAuthGuard)
export class EnergyUtilitiesController {
  constructor(private readonly energyutilitiesService: EnergyUtilitiesService) {}

  @Get()
  async findAll() {
    return this.energyutilitiesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.energyutilitiesService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: any) {
    return this.energyutilitiesService.create(createDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any) {
    return this.energyutilitiesService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.energyutilitiesService.delete(id);
  }
}
