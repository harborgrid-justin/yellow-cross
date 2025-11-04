/**
 * Bankruptcy Service
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseService } from '../common/base.service';
import { BankruptcyCase } from '../../models/sequelize/BankruptcyCase';

@Injectable()
export class BankruptcyService extends BaseService<BankruptcyCase> {
  constructor(
    @InjectModel(BankruptcyCase)
    model: typeof BankruptcyCase,
  ) {
    super(model);
  }
}
