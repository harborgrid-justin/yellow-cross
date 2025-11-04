/**
 * Litigation Module
 */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LitigationService } from './litigation.service';
import { LitigationController } from './litigation.controller';
import { LitigationMatter } from '../../models/sequelize/LitigationMatter';

@Module({
  imports: [SequelizeModule.forFeature([LitigationMatter])],
  controllers: [LitigationController],
  providers: [LitigationService],
  exports: [LitigationService],
})
export class LitigationModule {}
