/**
 * SportsEntertainment Controller
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
import { SportsEntertainmentService } from './sports-entertainment.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('sports')
@UseGuards(JwtAuthGuard)
export class SportsEntertainmentController {
  constructor(private readonly sportsentertainmentService: SportsEntertainmentService) {}

  @Get()
  async findAll() {
    return this.sportsentertainmentService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.sportsentertainmentService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: any) {
    return this.sportsentertainmentService.create(createDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any) {
    return this.sportsentertainmentService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.sportsentertainmentService.delete(id);
  }
}
