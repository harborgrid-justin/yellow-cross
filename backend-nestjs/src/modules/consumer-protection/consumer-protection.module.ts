/**
 * ConsumerProtection Module
 */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConsumerProtectionService } from './consumer-protection.service';
import { ConsumerProtectionController } from './consumer-protection.controller';
import { ConsumerProtectionMatter } from '../../models/sequelize/ConsumerProtectionMatter';

@Module({
  imports: [SequelizeModule.forFeature([ConsumerProtectionMatter])],
  controllers: [ConsumerProtectionController],
  providers: [ConsumerProtectionService],
  exports: [ConsumerProtectionService],
})
export class ConsumerProtectionModule {}
