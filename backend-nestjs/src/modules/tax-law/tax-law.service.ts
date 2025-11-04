/**
 * TaxLaw Service
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseService } from '../common/base.service';
import { TaxLawMatter } from '../../models/sequelize/TaxLawMatter';

@Injectable()
export class TaxLawService extends BaseService<TaxLawMatter> {
  constructor(
    @InjectModel(TaxLawMatter)
    model: typeof TaxLawMatter,
  ) {
    super(model);
  }
}
