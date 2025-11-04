/**
 * CriminalDefense Service
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseService } from '../common/base.service';
import { CriminalDefenseCase } from '../../models/sequelize/CriminalDefenseCase';

@Injectable()
export class CriminalDefenseService extends BaseService<CriminalDefenseCase> {
  constructor(
    @InjectModel(CriminalDefenseCase)
    model: typeof CriminalDefenseCase,
  ) {
    super(model);
  }
}
