/**
 * DataPrivacy Module
 */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DataPrivacyService } from './data-privacy.service';
import { DataPrivacyController } from './data-privacy.controller';
import { DataPrivacyMatter } from '../../models/sequelize/DataPrivacyMatter';

@Module({
  imports: [SequelizeModule.forFeature([DataPrivacyMatter])],
  controllers: [DataPrivacyController],
  providers: [DataPrivacyService],
  exports: [DataPrivacyService],
})
export class DataPrivacyModule {}
