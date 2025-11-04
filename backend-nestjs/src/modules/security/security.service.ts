/**
 * Security Service
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseService } from '../common/base.service';
import { SecurityAudit } from '../../models/sequelize/SecurityAudit';

@Injectable()
export class SecurityService extends BaseService<SecurityAudit> {
  constructor(
    @InjectModel(SecurityAudit)
    model: typeof SecurityAudit,
  ) {
    super(model);
  }
}
