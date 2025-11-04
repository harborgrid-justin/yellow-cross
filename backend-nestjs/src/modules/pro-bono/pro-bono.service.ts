/**
 * ProBono Service
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseService } from '../common/base.service';
import { ProBonoMatter } from '../../models/sequelize/ProBonoMatter';

@Injectable()
export class ProBonoService extends BaseService<ProBonoMatter> {
  constructor(
    @InjectModel(ProBonoMatter)
    model: typeof ProBonoMatter,
  ) {
    super(model);
  }
}
