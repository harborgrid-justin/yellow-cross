/**
 * AviationLaw Module
 */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AviationLawService } from './aviation-law.service';
import { AviationLawController } from './aviation-law.controller';
import { AviationLawMatter } from '../../models/sequelize/AviationLawMatter';

@Module({
  imports: [SequelizeModule.forFeature([AviationLawMatter])],
  controllers: [AviationLawController],
  providers: [AviationLawService],
  exports: [AviationLawService],
})
export class AviationLawModule {}
