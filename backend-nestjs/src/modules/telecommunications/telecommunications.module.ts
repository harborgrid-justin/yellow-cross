/**
 * Telecommunications Module
 */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TelecommunicationsService } from './telecommunications.service';
import { TelecommunicationsController } from './telecommunications.controller';
import { TelecommunicationsMatter } from '../../models/sequelize/TelecommunicationsMatter';

@Module({
  imports: [SequelizeModule.forFeature([TelecommunicationsMatter])],
  controllers: [TelecommunicationsController],
  providers: [TelecommunicationsService],
  exports: [TelecommunicationsService],
})
export class TelecommunicationsModule {}
