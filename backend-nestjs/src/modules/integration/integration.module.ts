/**
 * Integration Module
 */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { IntegrationService } from './integration.service';
import { IntegrationController } from './integration.controller';
import { Integration } from '../../models/sequelize/Integration';

@Module({
  imports: [SequelizeModule.forFeature([Integration])],
  controllers: [IntegrationController],
  providers: [IntegrationService],
  exports: [IntegrationService],
})
export class IntegrationModule {}
