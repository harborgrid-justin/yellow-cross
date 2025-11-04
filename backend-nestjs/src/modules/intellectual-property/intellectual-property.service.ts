/**
 * IntellectualProperty Service
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseService } from '../common/base.service';
import { IntellectualProperty } from '../../models/sequelize/IntellectualProperty';

@Injectable()
export class IntellectualPropertyService extends BaseService<IntellectualProperty> {
  constructor(
    @InjectModel(IntellectualProperty)
    model: typeof IntellectualProperty,
  ) {
    super(model);
  }
}
