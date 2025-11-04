/**
 * Court Service
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseService } from '../common/base.service';
import { CourtDocket } from '../../models/sequelize/CourtDocket';

@Injectable()
export class CourtService extends BaseService<CourtDocket> {
  constructor(
    @InjectModel(CourtDocket)
    model: typeof CourtDocket,
  ) {
    super(model);
  }
}
