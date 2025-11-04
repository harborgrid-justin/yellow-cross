/**
 * InternationalTrade Module
 */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { InternationalTradeService } from './international-trade.service';
import { InternationalTradeController } from './international-trade.controller';
import { InternationalTradeMatter } from '../../models/sequelize/InternationalTradeMatter';

@Module({
  imports: [SequelizeModule.forFeature([InternationalTradeMatter])],
  controllers: [InternationalTradeController],
  providers: [InternationalTradeService],
  exports: [InternationalTradeService],
})
export class InternationalTradeModule {}
