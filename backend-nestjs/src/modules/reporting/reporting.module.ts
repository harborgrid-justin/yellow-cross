/**
 * Reporting Module
 */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ReportingService } from './reporting.service';
import { ReportingController } from './reporting.controller';
import { Report } from '../../models/sequelize/Report';

@Module({
  imports: [SequelizeModule.forFeature([Report])],
  controllers: [ReportingController],
  providers: [ReportingService],
  exports: [ReportingService],
})
export class ReportingModule {}
