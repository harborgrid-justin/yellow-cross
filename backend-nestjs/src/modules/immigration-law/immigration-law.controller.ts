/**
 * ImmigrationLaw Controller
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
import { ImmigrationLawService } from './immigration-law.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('immigration')
@UseGuards(JwtAuthGuard)
export class ImmigrationLawController {
  constructor(private readonly immigrationlawService: ImmigrationLawService) {}

  @Get()
  async findAll() {
    return this.immigrationlawService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.immigrationlawService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: any) {
    return this.immigrationlawService.create(createDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any) {
    return this.immigrationlawService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.immigrationlawService.delete(id);
  }
}
