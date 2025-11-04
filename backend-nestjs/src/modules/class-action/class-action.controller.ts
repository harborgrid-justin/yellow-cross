/**
 * ClassAction Controller
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
import { ClassActionService } from './class-action.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('classaction')
@UseGuards(JwtAuthGuard)
export class ClassActionController {
  constructor(private readonly classactionService: ClassActionService) {}

  @Get()
  async findAll() {
    return this.classactionService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.classactionService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: any) {
    return this.classactionService.create(createDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any) {
    return this.classactionService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.classactionService.delete(id);
  }
}
