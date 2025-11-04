/**
 * Integration Controller
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
import { IntegrationService } from './integration.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('integrations')
@UseGuards(JwtAuthGuard)
export class IntegrationController {
  constructor(private readonly integrationService: IntegrationService) {}

  @Get()
  async findAll() {
    return this.integrationService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.integrationService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: any) {
    return this.integrationService.create(createDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any) {
    return this.integrationService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.integrationService.delete(id);
  }
}
