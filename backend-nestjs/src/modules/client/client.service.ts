/**
 * Client Service
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseService } from '../common/base.service';
import { Client } from '../../models/sequelize/Client';

@Injectable()
export class ClientService extends BaseService<Client> {
  constructor(
    @InjectModel(Client)
    model: typeof Client,
  ) {
    super(model);
  }
}
