/**
 * ConstructionLaw Service
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseService } from '../common/base.service';
import { ConstructionLawMatter } from '../../models/sequelize/ConstructionLawMatter';

@Injectable()
export class ConstructionLawService extends BaseService<ConstructionLawMatter> {
  constructor(
    @InjectModel(ConstructionLawMatter)
    model: typeof ConstructionLawMatter,
  ) {
    super(model);
  }
}
