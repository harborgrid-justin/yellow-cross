/**
 * SecuritiesLaw Module
 */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SecuritiesLawService } from './securities-law.service';
import { SecuritiesLawController } from './securities-law.controller';
import { SecuritiesLawMatter } from '../../models/sequelize/SecuritiesLawMatter';

@Module({
  imports: [SequelizeModule.forFeature([SecuritiesLawMatter])],
  controllers: [SecuritiesLawController],
  providers: [SecuritiesLawService],
  exports: [SecuritiesLawService],
})
export class SecuritiesLawModule {}
