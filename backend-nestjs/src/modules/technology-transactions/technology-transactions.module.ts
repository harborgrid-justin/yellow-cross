/**
 * TechnologyTransactions Module
 */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TechnologyTransactionsService } from './technology-transactions.service';
import { TechnologyTransactionsController } from './technology-transactions.controller';
import { TechnologyTransactionsMatter } from '../../models/sequelize/TechnologyTransactionsMatter';

@Module({
  imports: [SequelizeModule.forFeature([TechnologyTransactionsMatter])],
  controllers: [TechnologyTransactionsController],
  providers: [TechnologyTransactionsService],
  exports: [TechnologyTransactionsService],
})
export class TechnologyTransactionsModule {}
