/**
 * Mediation Controller
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
import { MediationService } from './mediation.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('mediation')
@UseGuards(JwtAuthGuard)
export class MediationController {
  constructor(private readonly mediationService: MediationService) {}

  @Get()
  async findAll() {
    return this.mediationService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.mediationService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: any) {
    return this.mediationService.create(createDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any) {
    return this.mediationService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.mediationService.delete(id);
  }
}
