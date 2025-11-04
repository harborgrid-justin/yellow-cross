/**
 * InsuranceDefense Service
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseService } from '../common/base.service';
import { InsuranceDefenseCase } from '../../models/sequelize/InsuranceDefenseCase';

@Injectable()
export class InsuranceDefenseService extends BaseService<InsuranceDefenseCase> {
  constructor(
    @InjectModel(InsuranceDefenseCase)
    model: typeof InsuranceDefenseCase,
  ) {
    super(model);
  }
}
