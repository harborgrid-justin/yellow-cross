/**
 * LandlordTenant Service
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseService } from '../common/base.service';
import { LandlordTenantMatter } from '../../models/sequelize/LandlordTenantMatter';

@Injectable()
export class LandlordTenantService extends BaseService<LandlordTenantMatter> {
  constructor(
    @InjectModel(LandlordTenantMatter)
    model: typeof LandlordTenantMatter,
  ) {
    super(model);
  }
}
