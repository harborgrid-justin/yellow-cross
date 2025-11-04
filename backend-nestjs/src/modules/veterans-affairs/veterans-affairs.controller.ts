/**
 * VeteransAffairs Controller
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
import { VeteransAffairsService } from './veterans-affairs.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('veterans')
@UseGuards(JwtAuthGuard)
export class VeteransAffairsController {
  constructor(private readonly veteransaffairsService: VeteransAffairsService) {}

  @Get()
  async findAll() {
    return this.veteransaffairsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.veteransaffairsService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: any) {
    return this.veteransaffairsService.create(createDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any) {
    return this.veteransaffairsService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.veteransaffairsService.delete(id);
  }
}
