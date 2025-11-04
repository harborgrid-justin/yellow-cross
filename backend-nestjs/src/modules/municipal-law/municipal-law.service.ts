/**
 * MunicipalLaw Service
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseService } from '../common/base.service';
import { MunicipalLawMatter } from '../../models/sequelize/MunicipalLawMatter';

@Injectable()
export class MunicipalLawService extends BaseService<MunicipalLawMatter> {
  constructor(
    @InjectModel(MunicipalLawMatter)
    model: typeof MunicipalLawMatter,
  ) {
    super(model);
  }
}
