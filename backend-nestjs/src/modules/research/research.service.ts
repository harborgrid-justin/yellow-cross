/**
 * Research Service
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseService } from '../common/base.service';
import { ResearchItem } from '../../models/sequelize/ResearchItem';

@Injectable()
export class ResearchService extends BaseService<ResearchItem> {
  constructor(
    @InjectModel(ResearchItem)
    model: typeof ResearchItem,
  ) {
    super(model);
  }
}
