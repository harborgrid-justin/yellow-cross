/**
 * FamilyLaw Module
 */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { FamilyLawService } from './family-law.service';
import { FamilyLawController } from './family-law.controller';
import { FamilyLawCase } from '../../models/sequelize/FamilyLawCase';

@Module({
  imports: [SequelizeModule.forFeature([FamilyLawCase])],
  controllers: [FamilyLawController],
  providers: [FamilyLawService],
  exports: [FamilyLawService],
})
export class FamilyLawModule {}
