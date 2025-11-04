/**
 * Telecommunications Service
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseService } from '../common/base.service';
import { TelecommunicationsMatter } from '../../models/sequelize/TelecommunicationsMatter';

@Injectable()
export class TelecommunicationsService extends BaseService<TelecommunicationsMatter> {
  constructor(
    @InjectModel(TelecommunicationsMatter)
    model: typeof TelecommunicationsMatter,
  ) {
    super(model);
  }
}
