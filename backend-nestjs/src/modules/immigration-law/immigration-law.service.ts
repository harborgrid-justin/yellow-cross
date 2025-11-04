/**
 * ImmigrationLaw Service
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseService } from '../common/base.service';
import { ImmigrationCase } from '../../models/sequelize/ImmigrationCase';

@Injectable()
export class ImmigrationLawService extends BaseService<ImmigrationCase> {
  constructor(
    @InjectModel(ImmigrationCase)
    model: typeof ImmigrationCase,
  ) {
    super(model);
  }
}
