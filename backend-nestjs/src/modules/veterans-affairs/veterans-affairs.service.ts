/**
 * VeteransAffairs Service
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseService } from '../common/base.service';
import { VeteransAffairsMatter } from '../../models/sequelize/VeteransAffairsMatter';

@Injectable()
export class VeteransAffairsService extends BaseService<VeteransAffairsMatter> {
  constructor(
    @InjectModel(VeteransAffairsMatter)
    model: typeof VeteransAffairsMatter,
  ) {
    super(model);
  }
}
