/**
 * EstatePlanning Service
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseService } from '../common/base.service';
import { EstatePlanningMatter } from '../../models/sequelize/EstatePlanningMatter';

@Injectable()
export class EstatePlanningService extends BaseService<EstatePlanningMatter> {
  constructor(
    @InjectModel(EstatePlanningMatter)
    model: typeof EstatePlanningMatter,
  ) {
    super(model);
  }
}
