/**
 * ProBono Controller
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
import { ProBonoService } from './pro-bono.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('probono')
@UseGuards(JwtAuthGuard)
export class ProBonoController {
  constructor(private readonly probonoService: ProBonoService) {}

  @Get()
  async findAll() {
    return this.probonoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.probonoService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: any) {
    return this.probonoService.create(createDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any) {
    return this.probonoService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.probonoService.delete(id);
  }
}
