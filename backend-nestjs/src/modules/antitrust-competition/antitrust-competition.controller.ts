/**
 * AntitrustCompetition Controller
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
import { AntitrustCompetitionService } from './antitrust-competition.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('antitrust')
@UseGuards(JwtAuthGuard)
export class AntitrustCompetitionController {
  constructor(private readonly antitrustcompetitionService: AntitrustCompetitionService) {}

  @Get()
  async findAll() {
    return this.antitrustcompetitionService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.antitrustcompetitionService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: any) {
    return this.antitrustcompetitionService.create(createDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any) {
    return this.antitrustcompetitionService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.antitrustcompetitionService.delete(id);
  }
}
