/**
 * GovernmentContracts Controller
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
import { GovernmentContractsService } from './government-contracts.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('govcontracts')
@UseGuards(JwtAuthGuard)
export class GovernmentContractsController {
  constructor(private readonly governmentcontractsService: GovernmentContractsService) {}

  @Get()
  async findAll() {
    return this.governmentcontractsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.governmentcontractsService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: any) {
    return this.governmentcontractsService.create(createDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any) {
    return this.governmentcontractsService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.governmentcontractsService.delete(id);
  }
}
