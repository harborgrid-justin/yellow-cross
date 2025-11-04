/**
 * HealthcareLaw Module
 */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { HealthcareLawService } from './healthcare-law.service';
import { HealthcareLawController } from './healthcare-law.controller';
import { HealthcareLawMatter } from '../../models/sequelize/HealthcareLawMatter';

@Module({
  imports: [SequelizeModule.forFeature([HealthcareLawMatter])],
  controllers: [HealthcareLawController],
  providers: [HealthcareLawService],
  exports: [HealthcareLawService],
})
export class HealthcareLawModule {}
