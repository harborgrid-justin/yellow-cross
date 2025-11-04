/**
 * IntellectualProperty Module
 */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { IntellectualPropertyService } from './intellectual-property.service';
import { IntellectualPropertyController } from './intellectual-property.controller';
import { IntellectualProperty } from '../../models/sequelize/IntellectualProperty';

@Module({
  imports: [SequelizeModule.forFeature([IntellectualProperty])],
  controllers: [IntellectualPropertyController],
  providers: [IntellectualPropertyService],
  exports: [IntellectualPropertyService],
})
export class IntellectualPropertyModule {}
