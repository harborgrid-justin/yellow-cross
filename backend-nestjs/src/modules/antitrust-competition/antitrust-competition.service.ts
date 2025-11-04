/**
 * AntitrustCompetition Service
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseService } from '../common/base.service';
import { AntitrustCompetitionMatter } from '../../models/sequelize/AntitrustCompetitionMatter';

@Injectable()
export class AntitrustCompetitionService extends BaseService<AntitrustCompetitionMatter> {
  constructor(
    @InjectModel(AntitrustCompetitionMatter)
    model: typeof AntitrustCompetitionMatter,
  ) {
    super(model);
  }
}
