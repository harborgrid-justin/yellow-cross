/**
 * NonProfitLaw Module
 */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { NonProfitLawService } from './non-profit-law.service';
import { NonProfitLawController } from './non-profit-law.controller';
import { NonProfitLawMatter } from '../../models/sequelize/NonProfitLawMatter';

@Module({
  imports: [SequelizeModule.forFeature([NonProfitLawMatter])],
  controllers: [NonProfitLawController],
  providers: [NonProfitLawService],
  exports: [NonProfitLawService],
})
export class NonProfitLawModule {}
