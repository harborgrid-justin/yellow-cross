/**
 * CorporateGovernance Service
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseService } from '../common/base.service';
import { CorporateGovernance } from '../../models/sequelize/CorporateGovernance';

@Injectable()
export class CorporateGovernanceService extends BaseService<CorporateGovernance> {
  constructor(
    @InjectModel(CorporateGovernance)
    model: typeof CorporateGovernance,
  ) {
    super(model);
  }
}
