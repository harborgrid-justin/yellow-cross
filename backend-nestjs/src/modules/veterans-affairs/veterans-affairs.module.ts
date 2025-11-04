/**
 * VeteransAffairs Module
 */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { VeteransAffairsService } from './veterans-affairs.service';
import { VeteransAffairsController } from './veterans-affairs.controller';
import { VeteransAffairsMatter } from '../../models/sequelize/VeteransAffairsMatter';

@Module({
  imports: [SequelizeModule.forFeature([VeteransAffairsMatter])],
  controllers: [VeteransAffairsController],
  providers: [VeteransAffairsService],
  exports: [VeteransAffairsService],
})
export class VeteransAffairsModule {}
