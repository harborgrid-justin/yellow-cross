/**
 * CriminalDefense Module
 */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CriminalDefenseService } from './criminal-defense.service';
import { CriminalDefenseController } from './criminal-defense.controller';
import { CriminalDefenseCase } from '../../models/sequelize/CriminalDefenseCase';

@Module({
  imports: [SequelizeModule.forFeature([CriminalDefenseCase])],
  controllers: [CriminalDefenseController],
  providers: [CriminalDefenseService],
  exports: [CriminalDefenseService],
})
export class CriminalDefenseModule {}
