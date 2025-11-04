/**
 * LaborRelations Module
 */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LaborRelationsService } from './labor-relations.service';
import { LaborRelationsController } from './labor-relations.controller';
import { LaborRelationsMatter } from '../../models/sequelize/LaborRelationsMatter';

@Module({
  imports: [SequelizeModule.forFeature([LaborRelationsMatter])],
  controllers: [LaborRelationsController],
  providers: [LaborRelationsService],
  exports: [LaborRelationsService],
})
export class LaborRelationsModule {}
