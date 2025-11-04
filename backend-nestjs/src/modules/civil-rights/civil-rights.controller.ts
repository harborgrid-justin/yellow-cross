/**
 * CivilRights Controller
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
import { CivilRightsService } from './civil-rights.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('civilrights')
@UseGuards(JwtAuthGuard)
export class CivilRightsController {
  constructor(private readonly civilrightsService: CivilRightsService) {}

  @Get()
  async findAll() {
    return this.civilrightsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.civilrightsService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: any) {
    return this.civilrightsService.create(createDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any) {
    return this.civilrightsService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.civilrightsService.delete(id);
  }
}
