/**
 * CorporateGovernance Controller
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
import { CorporateGovernanceService } from './corporate-governance.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('governance')
@UseGuards(JwtAuthGuard)
export class CorporateGovernanceController {
  constructor(private readonly corporategovernanceService: CorporateGovernanceService) {}

  @Get()
  async findAll() {
    return this.corporategovernanceService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.corporategovernanceService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: any) {
    return this.corporategovernanceService.create(createDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any) {
    return this.corporategovernanceService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.corporategovernanceService.delete(id);
  }
}
