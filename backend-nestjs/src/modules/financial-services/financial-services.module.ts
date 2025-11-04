/**
 * FinancialServices Module
 */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { FinancialServicesService } from './financial-services.service';
import { FinancialServicesController } from './financial-services.controller';
import { FinancialServicesMatter } from '../../models/sequelize/FinancialServicesMatter';

@Module({
  imports: [SequelizeModule.forFeature([FinancialServicesMatter])],
  controllers: [FinancialServicesController],
  providers: [FinancialServicesService],
  exports: [FinancialServicesService],
})
export class FinancialServicesModule {}
