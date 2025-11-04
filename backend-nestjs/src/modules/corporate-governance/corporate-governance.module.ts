/**
 * CorporateGovernance Module
 */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CorporateGovernanceService } from './corporate-governance.service';
import { CorporateGovernanceController } from './corporate-governance.controller';
import { CorporateGovernance } from '../../models/sequelize/CorporateGovernance';

@Module({
  imports: [SequelizeModule.forFeature([CorporateGovernance])],
  controllers: [CorporateGovernanceController],
  providers: [CorporateGovernanceService],
  exports: [CorporateGovernanceService],
})
export class CorporateGovernanceModule {}
