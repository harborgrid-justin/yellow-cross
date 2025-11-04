/**
 * LandlordTenant Controller
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
import { LandlordTenantService } from './landlord-tenant.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('landlordtenant')
@UseGuards(JwtAuthGuard)
export class LandlordTenantController {
  constructor(private readonly landlordtenantService: LandlordTenantService) {}

  @Get()
  async findAll() {
    return this.landlordtenantService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.landlordtenantService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: any) {
    return this.landlordtenantService.create(createDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any) {
    return this.landlordtenantService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.landlordtenantService.delete(id);
  }
}
