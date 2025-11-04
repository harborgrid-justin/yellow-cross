/**
 * Research Module
 */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ResearchService } from './research.service';
import { ResearchController } from './research.controller';
import { ResearchItem } from '../../models/sequelize/ResearchItem';

@Module({
  imports: [SequelizeModule.forFeature([ResearchItem])],
  controllers: [ResearchController],
  providers: [ResearchService],
  exports: [ResearchService],
})
export class ResearchModule {}
