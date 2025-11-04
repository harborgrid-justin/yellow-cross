/**
 * Billing Module
 */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BillingService } from './billing.service';
import { BillingController } from './billing.controller';
import { BillingEntry } from '../../models/sequelize/BillingEntry';

@Module({
  imports: [SequelizeModule.forFeature([BillingEntry])],
  controllers: [BillingController],
  providers: [BillingService],
  exports: [BillingService],
})
export class BillingModule {}
