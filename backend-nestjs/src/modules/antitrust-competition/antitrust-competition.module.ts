/**
 * AntitrustCompetition Module
 */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AntitrustCompetitionService } from './antitrust-competition.service';
import { AntitrustCompetitionController } from './antitrust-competition.controller';
import { AntitrustCompetitionMatter } from '../../models/sequelize/AntitrustCompetitionMatter';

@Module({
  imports: [SequelizeModule.forFeature([AntitrustCompetitionMatter])],
  controllers: [AntitrustCompetitionController],
  providers: [AntitrustCompetitionService],
  exports: [AntitrustCompetitionService],
})
export class AntitrustCompetitionModule {}
