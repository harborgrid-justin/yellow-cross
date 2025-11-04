/**
 * EmploymentLaw Module
 */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { EmploymentLawService } from './employment-law.service';
import { EmploymentLawController } from './employment-law.controller';
import { EmploymentLawMatter } from '../../models/sequelize/EmploymentLawMatter';

@Module({
  imports: [SequelizeModule.forFeature([EmploymentLawMatter])],
  controllers: [EmploymentLawController],
  providers: [EmploymentLawService],
  exports: [EmploymentLawService],
})
export class EmploymentLawModule {}
