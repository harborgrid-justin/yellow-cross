/**
 * AppellatePractice Controller
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
import { AppellatePracticeService } from './appellate-practice.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('appellate')
@UseGuards(JwtAuthGuard)
export class AppellatePracticeController {
  constructor(private readonly appellatepracticeService: AppellatePracticeService) {}

  @Get()
  async findAll() {
    return this.appellatepracticeService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.appellatepracticeService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: any) {
    return this.appellatepracticeService.create(createDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any) {
    return this.appellatepracticeService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.appellatepracticeService.delete(id);
  }
}
