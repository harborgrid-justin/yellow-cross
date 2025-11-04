/**
 * Mediation Service
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseService } from '../common/base.service';
import { Mediation } from '../../models/sequelize/Mediation';

@Injectable()
export class MediationService extends BaseService<Mediation> {
  constructor(
    @InjectModel(Mediation)
    model: typeof Mediation,
  ) {
    super(model);
  }
}
