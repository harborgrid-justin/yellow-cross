/**
 * MergersAcquisitions Module
 */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MergersAcquisitionsService } from './mergers-acquisitions.service';
import { MergersAcquisitionsController } from './mergers-acquisitions.controller';
import { MergerAcquisition } from '../../models/sequelize/MergerAcquisition';

@Module({
  imports: [SequelizeModule.forFeature([MergerAcquisition])],
  controllers: [MergersAcquisitionsController],
  providers: [MergersAcquisitionsService],
  exports: [MergersAcquisitionsService],
})
export class MergersAcquisitionsModule {}
