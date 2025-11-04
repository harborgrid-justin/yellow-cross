/**
 * PersonalInjury Controller
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
import { PersonalInjuryService } from './personal-injury.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('personalinjury')
@UseGuards(JwtAuthGuard)
export class PersonalInjuryController {
  constructor(private readonly personalinjuryService: PersonalInjuryService) {}

  @Get()
  async findAll() {
    return this.personalinjuryService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.personalinjuryService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: any) {
    return this.personalinjuryService.create(createDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any) {
    return this.personalinjuryService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.personalinjuryService.delete(id);
  }
}
