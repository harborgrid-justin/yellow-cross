/**
 * EducationLaw Module
 */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { EducationLawService } from './education-law.service';
import { EducationLawController } from './education-law.controller';
import { EducationLawMatter } from '../../models/sequelize/EducationLawMatter';

@Module({
  imports: [SequelizeModule.forFeature([EducationLawMatter])],
  controllers: [EducationLawController],
  providers: [EducationLawService],
  exports: [EducationLawService],
})
export class EducationLawModule {}
