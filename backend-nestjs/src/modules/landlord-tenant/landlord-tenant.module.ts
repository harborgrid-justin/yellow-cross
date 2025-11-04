/**
 * LandlordTenant Module
 */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LandlordTenantService } from './landlord-tenant.service';
import { LandlordTenantController } from './landlord-tenant.controller';
import { LandlordTenantMatter } from '../../models/sequelize/LandlordTenantMatter';

@Module({
  imports: [SequelizeModule.forFeature([LandlordTenantMatter])],
  controllers: [LandlordTenantController],
  providers: [LandlordTenantService],
  exports: [LandlordTenantService],
})
export class LandlordTenantModule {}
