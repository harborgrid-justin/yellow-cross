/**
 * AppellatePractice Service
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseService } from '../common/base.service';
import { AppellateCase } from '../../models/sequelize/AppellateCase';

@Injectable()
export class AppellatePracticeService extends BaseService<AppellateCase> {
  constructor(
    @InjectModel(AppellateCase)
    model: typeof AppellateCase,
  ) {
    super(model);
  }
}
