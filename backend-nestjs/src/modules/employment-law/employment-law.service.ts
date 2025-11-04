/**
 * EmploymentLaw Service
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseService } from '../common/base.service';
import { EmploymentLawMatter } from '../../models/sequelize/EmploymentLawMatter';

@Injectable()
export class EmploymentLawService extends BaseService<EmploymentLawMatter> {
  constructor(
    @InjectModel(EmploymentLawMatter)
    model: typeof EmploymentLawMatter,
  ) {
    super(model);
  }
}
