/**
 * SocialSecurity Controller
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
import { SocialSecurityService } from './social-security.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('socialsecurity')
@UseGuards(JwtAuthGuard)
export class SocialSecurityController {
  constructor(private readonly socialsecurityService: SocialSecurityService) {}

  @Get()
  async findAll() {
    return this.socialsecurityService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.socialsecurityService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: any) {
    return this.socialsecurityService.create(createDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any) {
    return this.socialsecurityService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.socialsecurityService.delete(id);
  }
}
