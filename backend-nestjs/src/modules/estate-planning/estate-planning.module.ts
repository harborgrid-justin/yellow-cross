/**
 * EstatePlanning Module
 */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { EstatePlanningService } from './estate-planning.service';
import { EstatePlanningController } from './estate-planning.controller';
import { EstatePlanningMatter } from '../../models/sequelize/EstatePlanningMatter';

@Module({
  imports: [SequelizeModule.forFeature([EstatePlanningMatter])],
  controllers: [EstatePlanningController],
  providers: [EstatePlanningService],
  exports: [EstatePlanningService],
})
export class EstatePlanningModule {}
