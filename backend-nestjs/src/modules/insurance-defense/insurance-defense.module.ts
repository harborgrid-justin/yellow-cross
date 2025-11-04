/**
 * InsuranceDefense Module
 */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { InsuranceDefenseService } from './insurance-defense.service';
import { InsuranceDefenseController } from './insurance-defense.controller';
import { InsuranceDefenseCase } from '../../models/sequelize/InsuranceDefenseCase';

@Module({
  imports: [SequelizeModule.forFeature([InsuranceDefenseCase])],
  controllers: [InsuranceDefenseController],
  providers: [InsuranceDefenseService],
  exports: [InsuranceDefenseService],
})
export class InsuranceDefenseModule {}
