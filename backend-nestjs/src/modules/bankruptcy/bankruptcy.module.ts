/**
 * Bankruptcy Module
 */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BankruptcyService } from './bankruptcy.service';
import { BankruptcyController } from './bankruptcy.controller';
import { BankruptcyCase } from '../../models/sequelize/BankruptcyCase';

@Module({
  imports: [SequelizeModule.forFeature([BankruptcyCase])],
  controllers: [BankruptcyController],
  providers: [BankruptcyService],
  exports: [BankruptcyService],
})
export class BankruptcyModule {}
