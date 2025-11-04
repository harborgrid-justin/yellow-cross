/**
 * Calendar Module
 */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CalendarService } from './calendar.service';
import { CalendarController } from './calendar.controller';
import { CalendarEvent } from '../../models/sequelize/CalendarEvent';

@Module({
  imports: [SequelizeModule.forFeature([CalendarEvent])],
  controllers: [CalendarController],
  providers: [CalendarService],
  exports: [CalendarService],
})
export class CalendarModule {}
