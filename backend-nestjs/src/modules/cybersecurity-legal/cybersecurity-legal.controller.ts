/**
 * CybersecurityLegal Controller
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
import { CybersecurityLegalService } from './cybersecurity-legal.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('cybersecurity')
@UseGuards(JwtAuthGuard)
export class CybersecurityLegalController {
  constructor(private readonly cybersecuritylegalService: CybersecurityLegalService) {}

  @Get()
  async findAll() {
    return this.cybersecuritylegalService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.cybersecuritylegalService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: any) {
    return this.cybersecuritylegalService.create(createDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any) {
    return this.cybersecuritylegalService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.cybersecuritylegalService.delete(id);
  }
}
