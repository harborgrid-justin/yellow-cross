/**
 * Document Service
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseService } from '../common/base.service';
import { Document } from '../../models/sequelize/Document';

@Injectable()
export class DocumentService extends BaseService<Document> {
  constructor(
    @InjectModel(Document)
    model: typeof Document,
  ) {
    super(model);
  }
}
