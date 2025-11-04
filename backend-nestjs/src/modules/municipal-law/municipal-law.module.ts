/**
 * MunicipalLaw Module
 */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MunicipalLawService } from './municipal-law.service';
import { MunicipalLawController } from './municipal-law.controller';
import { MunicipalLawMatter } from '../../models/sequelize/MunicipalLawMatter';

@Module({
  imports: [SequelizeModule.forFeature([MunicipalLawMatter])],
  controllers: [MunicipalLawController],
  providers: [MunicipalLawService],
  exports: [MunicipalLawService],
})
export class MunicipalLawModule {}
