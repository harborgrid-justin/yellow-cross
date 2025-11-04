/**
 * Court Module
 */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CourtService } from './court.service';
import { CourtController } from './court.controller';
import { CourtDocket } from '../../models/sequelize/CourtDocket';

@Module({
  imports: [SequelizeModule.forFeature([CourtDocket])],
  controllers: [CourtController],
  providers: [CourtService],
  exports: [CourtService],
})
export class CourtModule {}
