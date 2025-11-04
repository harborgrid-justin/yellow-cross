/**
 * InternationalTrade Service
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseService } from '../common/base.service';
import { InternationalTradeMatter } from '../../models/sequelize/InternationalTradeMatter';

@Injectable()
export class InternationalTradeService extends BaseService<InternationalTradeMatter> {
  constructor(
    @InjectModel(InternationalTradeMatter)
    model: typeof InternationalTradeMatter,
  ) {
    super(model);
  }
}
