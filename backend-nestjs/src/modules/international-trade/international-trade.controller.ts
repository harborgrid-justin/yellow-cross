/**
 * InternationalTrade Controller
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
import { InternationalTradeService } from './international-trade.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('trade')
@UseGuards(JwtAuthGuard)
export class InternationalTradeController {
  constructor(private readonly internationaltradeService: InternationalTradeService) {}

  @Get()
  async findAll() {
    return this.internationaltradeService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.internationaltradeService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: any) {
    return this.internationaltradeService.create(createDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any) {
    return this.internationaltradeService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.internationaltradeService.delete(id);
  }
}
