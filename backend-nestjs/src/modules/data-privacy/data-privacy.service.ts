/**
 * DataPrivacy Service
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseService } from '../common/base.service';
import { DataPrivacyMatter } from '../../models/sequelize/DataPrivacyMatter';

@Injectable()
export class DataPrivacyService extends BaseService<DataPrivacyMatter> {
  constructor(
    @InjectModel(DataPrivacyMatter)
    model: typeof DataPrivacyMatter,
  ) {
    super(model);
  }
}
