/**
 * MaritimeLaw Service
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseService } from '../common/base.service';
import { MaritimeLawMatter } from '../../models/sequelize/MaritimeLawMatter';

@Injectable()
export class MaritimeLawService extends BaseService<MaritimeLawMatter> {
  constructor(
    @InjectModel(MaritimeLawMatter)
    model: typeof MaritimeLawMatter,
  ) {
    super(model);
  }
}
