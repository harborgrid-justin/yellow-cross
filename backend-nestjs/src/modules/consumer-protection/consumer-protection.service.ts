/**
 * ConsumerProtection Service
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseService } from '../common/base.service';
import { ConsumerProtectionMatter } from '../../models/sequelize/ConsumerProtectionMatter';

@Injectable()
export class ConsumerProtectionService extends BaseService<ConsumerProtectionMatter> {
  constructor(
    @InjectModel(ConsumerProtectionMatter)
    model: typeof ConsumerProtectionMatter,
  ) {
    super(model);
  }
}
