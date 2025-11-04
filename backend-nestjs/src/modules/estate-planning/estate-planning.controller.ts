/**
 * EstatePlanning Controller
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
import { EstatePlanningService } from './estate-planning.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('estate')
@UseGuards(JwtAuthGuard)
export class EstatePlanningController {
  constructor(private readonly estateplanningService: EstatePlanningService) {}

  @Get()
  async findAll() {
    return this.estateplanningService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.estateplanningService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: any) {
    return this.estateplanningService.create(createDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any) {
    return this.estateplanningService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.estateplanningService.delete(id);
  }
}
