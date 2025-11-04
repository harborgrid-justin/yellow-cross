/**
 * PersonalInjury Service
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseService } from '../common/base.service';
import { PersonalInjuryCase } from '../../models/sequelize/PersonalInjuryCase';

@Injectable()
export class PersonalInjuryService extends BaseService<PersonalInjuryCase> {
  constructor(
    @InjectModel(PersonalInjuryCase)
    model: typeof PersonalInjuryCase,
  ) {
    super(model);
  }
}
