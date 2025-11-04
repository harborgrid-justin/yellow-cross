/**
 * ConstructionLaw Module
 */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConstructionLawService } from './construction-law.service';
import { ConstructionLawController } from './construction-law.controller';
import { ConstructionLawMatter } from '../../models/sequelize/ConstructionLawMatter';

@Module({
  imports: [SequelizeModule.forFeature([ConstructionLawMatter])],
  controllers: [ConstructionLawController],
  providers: [ConstructionLawService],
  exports: [ConstructionLawService],
})
export class ConstructionLawModule {}
