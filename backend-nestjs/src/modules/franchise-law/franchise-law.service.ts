/**
 * FranchiseLaw Service
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseService } from '../common/base.service';
import { FranchiseLawMatter } from '../../models/sequelize/FranchiseLawMatter';

@Injectable()
export class FranchiseLawService extends BaseService<FranchiseLawMatter> {
  constructor(
    @InjectModel(FranchiseLawMatter)
    model: typeof FranchiseLawMatter,
  ) {
    super(model);
  }
}
