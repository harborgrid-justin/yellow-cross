/**
 * SecuritiesLaw Service
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseService } from '../common/base.service';
import { SecuritiesLawMatter } from '../../models/sequelize/SecuritiesLawMatter';

@Injectable()
export class SecuritiesLawService extends BaseService<SecuritiesLawMatter> {
  constructor(
    @InjectModel(SecuritiesLawMatter)
    model: typeof SecuritiesLawMatter,
  ) {
    super(model);
  }
}
