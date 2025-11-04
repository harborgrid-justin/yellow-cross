/**
 * Litigation Service
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseService } from '../common/base.service';
import { LitigationMatter } from '../../models/sequelize/LitigationMatter';

@Injectable()
export class LitigationService extends BaseService<LitigationMatter> {
  constructor(
    @InjectModel(LitigationMatter)
    model: typeof LitigationMatter,
  ) {
    super(model);
  }
}
