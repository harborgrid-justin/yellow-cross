/**
 * SocialSecurity Service
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseService } from '../common/base.service';
import { SocialSecurityMatter } from '../../models/sequelize/SocialSecurityMatter';

@Injectable()
export class SocialSecurityService extends BaseService<SocialSecurityMatter> {
  constructor(
    @InjectModel(SocialSecurityMatter)
    model: typeof SocialSecurityMatter,
  ) {
    super(model);
  }
}
