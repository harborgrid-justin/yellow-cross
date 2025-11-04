/**
 * ConstructionLaw Controller
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
import { ConstructionLawService } from './construction-law.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('construction')
@UseGuards(JwtAuthGuard)
export class ConstructionLawController {
  constructor(private readonly constructionlawService: ConstructionLawService) {}

  @Get()
  async findAll() {
    return this.constructionlawService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.constructionlawService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: any) {
    return this.constructionlawService.create(createDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any) {
    return this.constructionlawService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.constructionlawService.delete(id);
  }
}
