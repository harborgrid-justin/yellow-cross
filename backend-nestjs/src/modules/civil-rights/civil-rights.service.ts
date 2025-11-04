/**
 * CivilRights Service
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseService } from '../common/base.service';
import { CivilRightsMatter } from '../../models/sequelize/CivilRightsMatter';

@Injectable()
export class CivilRightsService extends BaseService<CivilRightsMatter> {
  constructor(
    @InjectModel(CivilRightsMatter)
    model: typeof CivilRightsMatter,
  ) {
    super(model);
  }
}
