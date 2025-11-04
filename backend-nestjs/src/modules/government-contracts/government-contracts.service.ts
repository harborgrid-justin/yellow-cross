/**
 * GovernmentContracts Service
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseService } from '../common/base.service';
import { GovernmentContractsMatter } from '../../models/sequelize/GovernmentContractsMatter';

@Injectable()
export class GovernmentContractsService extends BaseService<GovernmentContractsMatter> {
  constructor(
    @InjectModel(GovernmentContractsMatter)
    model: typeof GovernmentContractsMatter,
  ) {
    super(model);
  }
}
