/**
 * HealthcareLaw Service
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseService } from '../common/base.service';
import { HealthcareLawMatter } from '../../models/sequelize/HealthcareLawMatter';

@Injectable()
export class HealthcareLawService extends BaseService<HealthcareLawMatter> {
  constructor(
    @InjectModel(HealthcareLawMatter)
    model: typeof HealthcareLawMatter,
  ) {
    super(model);
  }
}
