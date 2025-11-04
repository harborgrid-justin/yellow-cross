/**
 * EDiscovery Service
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseService } from '../common/base.service';
import { Evidence } from '../../models/sequelize/Evidence';

@Injectable()
export class EDiscoveryService extends BaseService<Evidence> {
  constructor(
    @InjectModel(Evidence)
    model: typeof Evidence,
  ) {
    super(model);
  }
}
