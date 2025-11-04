/**
 * RealEstate Service
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseService } from '../common/base.service';
import { RealEstateTransaction } from '../../models/sequelize/RealEstateTransaction';

@Injectable()
export class RealEstateService extends BaseService<RealEstateTransaction> {
  constructor(
    @InjectModel(RealEstateTransaction)
    model: typeof RealEstateTransaction,
  ) {
    super(model);
  }
}
