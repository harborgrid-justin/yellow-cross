/**
 * RealEstate Module
 */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RealEstateService } from './real-estate.service';
import { RealEstateController } from './real-estate.controller';
import { RealEstateTransaction } from '../../models/sequelize/RealEstateTransaction';

@Module({
  imports: [SequelizeModule.forFeature([RealEstateTransaction])],
  controllers: [RealEstateController],
  providers: [RealEstateService],
  exports: [RealEstateService],
})
export class RealEstateModule {}
