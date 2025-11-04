/**
 * Calendar Service
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseService } from '../common/base.service';
import { CalendarEvent } from '../../models/sequelize/CalendarEvent';

@Injectable()
export class CalendarService extends BaseService<CalendarEvent> {
  constructor(
    @InjectModel(CalendarEvent)
    model: typeof CalendarEvent,
  ) {
    super(model);
  }
}
