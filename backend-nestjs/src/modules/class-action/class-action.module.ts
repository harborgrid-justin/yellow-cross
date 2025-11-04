/**
 * ClassAction Module
 */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ClassActionService } from './class-action.service';
import { ClassActionController } from './class-action.controller';
import { ClassActionCase } from '../../models/sequelize/ClassActionCase';

@Module({
  imports: [SequelizeModule.forFeature([ClassActionCase])],
  controllers: [ClassActionController],
  providers: [ClassActionService],
  exports: [ClassActionService],
})
export class ClassActionModule {}
