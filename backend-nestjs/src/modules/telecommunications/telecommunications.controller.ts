/**
 * Telecommunications Controller
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
import { TelecommunicationsService } from './telecommunications.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('telecom')
@UseGuards(JwtAuthGuard)
export class TelecommunicationsController {
  constructor(private readonly telecommunicationsService: TelecommunicationsService) {}

  @Get()
  async findAll() {
    return this.telecommunicationsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.telecommunicationsService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: any) {
    return this.telecommunicationsService.create(createDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any) {
    return this.telecommunicationsService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.telecommunicationsService.delete(id);
  }
}
