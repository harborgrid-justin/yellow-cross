/**
 * MergersAcquisitions Service
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseService } from '../common/base.service';
import { MergerAcquisition } from '../../models/sequelize/MergerAcquisition';

@Injectable()
export class MergersAcquisitionsService extends BaseService<MergerAcquisition> {
  constructor(
    @InjectModel(MergerAcquisition)
    model: typeof MergerAcquisition,
  ) {
    super(model);
  }
}
