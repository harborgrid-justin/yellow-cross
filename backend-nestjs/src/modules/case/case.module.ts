/**
 * Case Module
 */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CaseService } from './case.service';
import { CaseController } from './case.controller';
import { Case } from '../../models/sequelize/Case';
import { CaseNote } from '../../models/sequelize/CaseNote';
import { CaseTimelineEvent } from '../../models/sequelize/CaseTimelineEvent';

@Module({
  imports: [SequelizeModule.forFeature([Case, CaseNote, CaseTimelineEvent])],
  controllers: [CaseController],
  providers: [CaseService],
  exports: [CaseService],
})
export class CaseModule {}
