/**
 * CivilRights Module
 */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CivilRightsService } from './civil-rights.service';
import { CivilRightsController } from './civil-rights.controller';
import { CivilRightsMatter } from '../../models/sequelize/CivilRightsMatter';

@Module({
  imports: [SequelizeModule.forFeature([CivilRightsMatter])],
  controllers: [CivilRightsController],
  providers: [CivilRightsService],
  exports: [CivilRightsService],
})
export class CivilRightsModule {}
