/**
 * SportsEntertainment Module
 */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SportsEntertainmentService } from './sports-entertainment.service';
import { SportsEntertainmentController } from './sports-entertainment.controller';
import { SportsEntertainmentMatter } from '../../models/sequelize/SportsEntertainmentMatter';

@Module({
  imports: [SequelizeModule.forFeature([SportsEntertainmentMatter])],
  controllers: [SportsEntertainmentController],
  providers: [SportsEntertainmentService],
  exports: [SportsEntertainmentService],
})
export class SportsEntertainmentModule {}
