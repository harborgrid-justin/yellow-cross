/**
 * EducationLaw Service
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseService } from '../common/base.service';
import { EducationLawMatter } from '../../models/sequelize/EducationLawMatter';

@Injectable()
export class EducationLawService extends BaseService<EducationLawMatter> {
  constructor(
    @InjectModel(EducationLawMatter)
    model: typeof EducationLawMatter,
  ) {
    super(model);
  }
}
