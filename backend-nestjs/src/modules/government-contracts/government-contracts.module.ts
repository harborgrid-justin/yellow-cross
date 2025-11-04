/**
 * GovernmentContracts Module
 */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { GovernmentContractsService } from './government-contracts.service';
import { GovernmentContractsController } from './government-contracts.controller';
import { GovernmentContractsMatter } from '../../models/sequelize/GovernmentContractsMatter';

@Module({
  imports: [SequelizeModule.forFeature([GovernmentContractsMatter])],
  controllers: [GovernmentContractsController],
  providers: [GovernmentContractsService],
  exports: [GovernmentContractsService],
})
export class GovernmentContractsModule {}
