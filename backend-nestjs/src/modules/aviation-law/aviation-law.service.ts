/**
 * AviationLaw Service
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseService } from '../common/base.service';
import { AviationLawMatter } from '../../models/sequelize/AviationLawMatter';

@Injectable()
export class AviationLawService extends BaseService<AviationLawMatter> {
  constructor(
    @InjectModel(AviationLawMatter)
    model: typeof AviationLawMatter,
  ) {
    super(model);
  }
}
