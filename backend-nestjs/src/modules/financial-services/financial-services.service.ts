/**
 * FinancialServices Service
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseService } from '../common/base.service';
import { FinancialServicesMatter } from '../../models/sequelize/FinancialServicesMatter';

@Injectable()
export class FinancialServicesService extends BaseService<FinancialServicesMatter> {
  constructor(
    @InjectModel(FinancialServicesMatter)
    model: typeof FinancialServicesMatter,
  ) {
    super(model);
  }
}
