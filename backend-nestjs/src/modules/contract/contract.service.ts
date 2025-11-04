/**
 * Contract Service
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseService } from '../common/base.service';
import { Contract } from '../../models/sequelize/Contract';

@Injectable()
export class ContractService extends BaseService<Contract> {
  constructor(
    @InjectModel(Contract)
    model: typeof Contract,
  ) {
    super(model);
  }
}
