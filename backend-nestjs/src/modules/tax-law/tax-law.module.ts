/**
 * TaxLaw Module
 */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TaxLawService } from './tax-law.service';
import { TaxLawController } from './tax-law.controller';
import { TaxLawMatter } from '../../models/sequelize/TaxLawMatter';

@Module({
  imports: [SequelizeModule.forFeature([TaxLawMatter])],
  controllers: [TaxLawController],
  providers: [TaxLawService],
  exports: [TaxLawService],
})
export class TaxLawModule {}
