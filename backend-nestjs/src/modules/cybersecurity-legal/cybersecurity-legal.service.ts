/**
 * CybersecurityLegal Service
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseService } from '../common/base.service';
import { CybersecurityLegalMatter } from '../../models/sequelize/CybersecurityLegalMatter';

@Injectable()
export class CybersecurityLegalService extends BaseService<CybersecurityLegalMatter> {
  constructor(
    @InjectModel(CybersecurityLegalMatter)
    model: typeof CybersecurityLegalMatter,
  ) {
    super(model);
  }
}
