/**
 * ImmigrationLaw Module
 */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ImmigrationLawService } from './immigration-law.service';
import { ImmigrationLawController } from './immigration-law.controller';
import { ImmigrationCase } from '../../models/sequelize/ImmigrationCase';

@Module({
  imports: [SequelizeModule.forFeature([ImmigrationCase])],
  controllers: [ImmigrationLawController],
  providers: [ImmigrationLawService],
  exports: [ImmigrationLawService],
})
export class ImmigrationLawModule {}
