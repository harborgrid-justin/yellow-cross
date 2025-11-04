/**
 * EDiscovery Controller
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
import { EDiscoveryService } from './ediscovery.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('ediscovery')
@UseGuards(JwtAuthGuard)
export class EDiscoveryController {
  constructor(private readonly ediscoveryService: EDiscoveryService) {}

  @Get()
  async findAll() {
    return this.ediscoveryService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.ediscoveryService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: any) {
    return this.ediscoveryService.create(createDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any) {
    return this.ediscoveryService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.ediscoveryService.delete(id);
  }
}
