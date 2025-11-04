/**
 * EnvironmentalLaw Module
 */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { EnvironmentalLawService } from './environmental-law.service';
import { EnvironmentalLawController } from './environmental-law.controller';
import { EnvironmentalLawMatter } from '../../models/sequelize/EnvironmentalLawMatter';

@Module({
  imports: [SequelizeModule.forFeature([EnvironmentalLawMatter])],
  controllers: [EnvironmentalLawController],
  providers: [EnvironmentalLawService],
  exports: [EnvironmentalLawService],
})
export class EnvironmentalLawModule {}
