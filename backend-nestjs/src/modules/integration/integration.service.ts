/**
 * Integration Service
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseService } from '../common/base.service';
import { Integration } from '../../models/sequelize/Integration';

@Injectable()
export class IntegrationService extends BaseService<Integration> {
  constructor(
    @InjectModel(Integration)
    model: typeof Integration,
  ) {
    super(model);
  }
}
