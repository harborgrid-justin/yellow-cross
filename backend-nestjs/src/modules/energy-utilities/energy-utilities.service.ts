/**
 * EnergyUtilities Service
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseService } from '../common/base.service';
import { EnergyUtilitiesMatter } from '../../models/sequelize/EnergyUtilitiesMatter';

@Injectable()
export class EnergyUtilitiesService extends BaseService<EnergyUtilitiesMatter> {
  constructor(
    @InjectModel(EnergyUtilitiesMatter)
    model: typeof EnergyUtilitiesMatter,
  ) {
    super(model);
  }
}
