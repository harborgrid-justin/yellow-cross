/**
 * EnergyUtilities Module
 */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { EnergyUtilitiesService } from './energy-utilities.service';
import { EnergyUtilitiesController } from './energy-utilities.controller';
import { EnergyUtilitiesMatter } from '../../models/sequelize/EnergyUtilitiesMatter';

@Module({
  imports: [SequelizeModule.forFeature([EnergyUtilitiesMatter])],
  controllers: [EnergyUtilitiesController],
  providers: [EnergyUtilitiesService],
  exports: [EnergyUtilitiesService],
})
export class EnergyUtilitiesModule {}
