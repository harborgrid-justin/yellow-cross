/**
 * AppellatePractice Module
 */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppellatePracticeService } from './appellate-practice.service';
import { AppellatePracticeController } from './appellate-practice.controller';
import { AppellateCase } from '../../models/sequelize/AppellateCase';

@Module({
  imports: [SequelizeModule.forFeature([AppellateCase])],
  controllers: [AppellatePracticeController],
  providers: [AppellatePracticeService],
  exports: [AppellatePracticeService],
})
export class AppellatePracticeModule {}
