/**
 * Reporting Service
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseService } from '../common/base.service';
import { Report } from '../../models/sequelize/Report';

@Injectable()
export class ReportingService extends BaseService<Report> {
  constructor(
    @InjectModel(Report)
    model: typeof Report,
  ) {
    super(model);
  }
}
