/**
 * CriminalDefense Controller
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
import { CriminalDefenseService } from './criminal-defense.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('criminal')
@UseGuards(JwtAuthGuard)
export class CriminalDefenseController {
  constructor(private readonly criminaldefenseService: CriminalDefenseService) {}

  @Get()
  async findAll() {
    return this.criminaldefenseService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.criminaldefenseService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: any) {
    return this.criminaldefenseService.create(createDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any) {
    return this.criminaldefenseService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.criminaldefenseService.delete(id);
  }
}
