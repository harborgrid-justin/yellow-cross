/**
 * Communication Service
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseService } from '../common/base.service';
import { Message } from '../../models/sequelize/Message';

@Injectable()
export class CommunicationService extends BaseService<Message> {
  constructor(
    @InjectModel(Message)
    model: typeof Message,
  ) {
    super(model);
  }
}
