/**
 * MaritimeLaw Module
 */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MaritimeLawService } from './maritime-law.service';
import { MaritimeLawController } from './maritime-law.controller';
import { MaritimeLawMatter } from '../../models/sequelize/MaritimeLawMatter';

@Module({
  imports: [SequelizeModule.forFeature([MaritimeLawMatter])],
  controllers: [MaritimeLawController],
  providers: [MaritimeLawService],
  exports: [MaritimeLawService],
})
export class MaritimeLawModule {}
