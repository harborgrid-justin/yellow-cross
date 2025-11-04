/**
 * Security Service
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseService } from '../common/base.service';
import { SecurityAuditLog } from '../../models/sequelize/SecurityAuditLog';

@Injectable()
export class SecurityService extends BaseService<SecurityAuditLog> {
  constructor(
    @InjectModel(SecurityAuditLog)
    model: typeof SecurityAuditLog,
  ) {
    super(model);
  }
}
