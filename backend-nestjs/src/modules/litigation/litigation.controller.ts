/**
 * Litigation Controller
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
import { LitigationService } from './litigation.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('litigation')
@UseGuards(JwtAuthGuard)
export class LitigationController {
  constructor(private readonly litigationService: LitigationService) {}

  @Get()
  async findAll() {
    return this.litigationService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.litigationService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: any) {
    return this.litigationService.create(createDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any) {
    return this.litigationService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.litigationService.delete(id);
  }
}
