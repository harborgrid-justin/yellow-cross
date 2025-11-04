/**
 * FranchiseLaw Controller
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
import { FranchiseLawService } from './franchise-law.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('franchise')
@UseGuards(JwtAuthGuard)
export class FranchiseLawController {
  constructor(private readonly franchiselawService: FranchiseLawService) {}

  @Get()
  async findAll() {
    return this.franchiselawService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.franchiselawService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: any) {
    return this.franchiselawService.create(createDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any) {
    return this.franchiselawService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.franchiselawService.delete(id);
  }
}
