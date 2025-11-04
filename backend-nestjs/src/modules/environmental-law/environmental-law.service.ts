/**
 * EnvironmentalLaw Service
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseService } from '../common/base.service';
import { EnvironmentalLawMatter } from '../../models/sequelize/EnvironmentalLawMatter';

@Injectable()
export class EnvironmentalLawService extends BaseService<EnvironmentalLawMatter> {
  constructor(
    @InjectModel(EnvironmentalLawMatter)
    model: typeof EnvironmentalLawMatter,
  ) {
    super(model);
  }
}
