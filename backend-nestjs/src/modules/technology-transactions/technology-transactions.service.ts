/**
 * TechnologyTransactions Service
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseService } from '../common/base.service';
import { TechnologyTransactionsMatter } from '../../models/sequelize/TechnologyTransactionsMatter';

@Injectable()
export class TechnologyTransactionsService extends BaseService<TechnologyTransactionsMatter> {
  constructor(
    @InjectModel(TechnologyTransactionsMatter)
    model: typeof TechnologyTransactionsMatter,
  ) {
    super(model);
  }
}
