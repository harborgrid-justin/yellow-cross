/**
 * Billing Module
 */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BillingService } from './billing.service';
import { BillingController } from './billing.controller';
import { TimeEntry } from '../../models/sequelize/TimeEntry';

@Module({
  imports: [SequelizeModule.forFeature([TimeEntry])],
  controllers: [BillingController],
  providers: [BillingService],
  exports: [BillingService],
})
export class BillingModule {}
