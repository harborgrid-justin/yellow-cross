/**
 * SportsEntertainment Service
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseService } from '../common/base.service';
import { SportsEntertainmentMatter } from '../../models/sequelize/SportsEntertainmentMatter';

@Injectable()
export class SportsEntertainmentService extends BaseService<SportsEntertainmentMatter> {
  constructor(
    @InjectModel(SportsEntertainmentMatter)
    model: typeof SportsEntertainmentMatter,
  ) {
    super(model);
  }
}
