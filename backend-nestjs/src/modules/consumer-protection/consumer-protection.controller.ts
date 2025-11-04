/**
 * ConsumerProtection Controller
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
import { ConsumerProtectionService } from './consumer-protection.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('consumer')
@UseGuards(JwtAuthGuard)
export class ConsumerProtectionController {
  constructor(private readonly consumerprotectionService: ConsumerProtectionService) {}

  @Get()
  async findAll() {
    return this.consumerprotectionService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.consumerprotectionService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: any) {
    return this.consumerprotectionService.create(createDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any) {
    return this.consumerprotectionService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.consumerprotectionService.delete(id);
  }
}
