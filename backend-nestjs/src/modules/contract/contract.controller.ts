/**
 * Contract Controller
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
import { ContractService } from './contract.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('contracts')
@UseGuards(JwtAuthGuard)
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Get()
  async findAll() {
    return this.contractService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.contractService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: any) {
    return this.contractService.create(createDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any) {
    return this.contractService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.contractService.delete(id);
  }
}
