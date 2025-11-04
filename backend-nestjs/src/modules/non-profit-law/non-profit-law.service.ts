/**
 * NonProfitLaw Service
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseService } from '../common/base.service';
import { NonProfitLawMatter } from '../../models/sequelize/NonProfitLawMatter';

@Injectable()
export class NonProfitLawService extends BaseService<NonProfitLawMatter> {
  constructor(
    @InjectModel(NonProfitLawMatter)
    model: typeof NonProfitLawMatter,
  ) {
    super(model);
  }
}
