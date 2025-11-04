/**
 * Compliance Module
 */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ComplianceService } from './compliance.service';
import { ComplianceController } from './compliance.controller';
import { ComplianceItem } from '../../models/sequelize/ComplianceItem';

@Module({
  imports: [SequelizeModule.forFeature([ComplianceItem])],
  controllers: [ComplianceController],
  providers: [ComplianceService],
  exports: [ComplianceService],
})
export class ComplianceModule {}
