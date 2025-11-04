/**
 * WhiteCollarCrime Controller
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
import { WhiteCollarCrimeService } from './white-collar-crime.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('whitecollar')
@UseGuards(JwtAuthGuard)
export class WhiteCollarCrimeController {
  constructor(private readonly whitecollarcrimeService: WhiteCollarCrimeService) {}

  @Get()
  async findAll() {
    return this.whitecollarcrimeService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.whitecollarcrimeService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: any) {
    return this.whitecollarcrimeService.create(createDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any) {
    return this.whitecollarcrimeService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.whitecollarcrimeService.delete(id);
  }
}
