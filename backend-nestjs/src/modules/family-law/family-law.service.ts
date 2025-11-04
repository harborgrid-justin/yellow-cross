/**
 * FamilyLaw Service
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseService } from '../common/base.service';
import { FamilyLawCase } from '../../models/sequelize/FamilyLawCase';

@Injectable()
export class FamilyLawService extends BaseService<FamilyLawCase> {
  constructor(
    @InjectModel(FamilyLawCase)
    model: typeof FamilyLawCase,
  ) {
    super(model);
  }
}
