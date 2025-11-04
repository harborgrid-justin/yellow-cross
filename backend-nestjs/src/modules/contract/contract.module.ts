/**
 * Contract Module
 */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ContractService } from './contract.service';
import { ContractController } from './contract.controller';
import { Contract } from '../../models/sequelize/Contract';

@Module({
  imports: [SequelizeModule.forFeature([Contract])],
  controllers: [ContractController],
  providers: [ContractService],
  exports: [ContractService],
})
export class ContractModule {}
