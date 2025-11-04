/**
 * TechnologyTransactions Controller
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
import { TechnologyTransactionsService } from './technology-transactions.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('technology')
@UseGuards(JwtAuthGuard)
export class TechnologyTransactionsController {
  constructor(private readonly technologytransactionsService: TechnologyTransactionsService) {}

  @Get()
  async findAll() {
    return this.technologytransactionsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.technologytransactionsService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: any) {
    return this.technologytransactionsService.create(createDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any) {
    return this.technologytransactionsService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.technologytransactionsService.delete(id);
  }
}
