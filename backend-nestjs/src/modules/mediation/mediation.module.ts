/**
 * Mediation Module
 */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MediationService } from './mediation.service';
import { MediationController } from './mediation.controller';
import { Mediation } from '../../models/sequelize/Mediation';

@Module({
  imports: [SequelizeModule.forFeature([Mediation])],
  controllers: [MediationController],
  providers: [MediationService],
  exports: [MediationService],
})
export class MediationModule {}
