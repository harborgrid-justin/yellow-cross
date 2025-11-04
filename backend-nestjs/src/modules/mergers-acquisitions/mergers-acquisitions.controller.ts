/**
 * MergersAcquisitions Controller
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
import { MergersAcquisitionsService } from './mergers-acquisitions.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('manda')
@UseGuards(JwtAuthGuard)
export class MergersAcquisitionsController {
  constructor(private readonly mergersacquisitionsService: MergersAcquisitionsService) {}

  @Get()
  async findAll() {
    return this.mergersacquisitionsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.mergersacquisitionsService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: any) {
    return this.mergersacquisitionsService.create(createDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any) {
    return this.mergersacquisitionsService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.mergersacquisitionsService.delete(id);
  }
}
