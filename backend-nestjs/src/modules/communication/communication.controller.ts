/**
 * Communication Controller
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
import { CommunicationService } from './communication.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('communication')
@UseGuards(JwtAuthGuard)
export class CommunicationController {
  constructor(private readonly communicationService: CommunicationService) {}

  @Get()
  async findAll() {
    return this.communicationService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.communicationService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: any) {
    return this.communicationService.create(createDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any) {
    return this.communicationService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.communicationService.delete(id);
  }
}
