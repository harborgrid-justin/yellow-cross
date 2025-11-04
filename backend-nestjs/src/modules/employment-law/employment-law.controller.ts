/**
 * EmploymentLaw Controller
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
import { EmploymentLawService } from './employment-law.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('employment')
@UseGuards(JwtAuthGuard)
export class EmploymentLawController {
  constructor(private readonly employmentlawService: EmploymentLawService) {}

  @Get()
  async findAll() {
    return this.employmentlawService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.employmentlawService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: any) {
    return this.employmentlawService.create(createDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any) {
    return this.employmentlawService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.employmentlawService.delete(id);
  }
}
