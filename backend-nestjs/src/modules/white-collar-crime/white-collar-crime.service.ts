/**
 * WhiteCollarCrime Service
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseService } from '../common/base.service';
import { WhiteCollarCrimeMatter } from '../../models/sequelize/WhiteCollarCrimeMatter';

@Injectable()
export class WhiteCollarCrimeService extends BaseService<WhiteCollarCrimeMatter> {
  constructor(
    @InjectModel(WhiteCollarCrimeMatter)
    model: typeof WhiteCollarCrimeMatter,
  ) {
    super(model);
  }
}
