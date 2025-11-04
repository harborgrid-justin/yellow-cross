/**
 * ProBono Module
 */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProBonoService } from './pro-bono.service';
import { ProBonoController } from './pro-bono.controller';
import { ProBonoMatter } from '../../models/sequelize/ProBonoMatter';

@Module({
  imports: [SequelizeModule.forFeature([ProBonoMatter])],
  controllers: [ProBonoController],
  providers: [ProBonoService],
  exports: [ProBonoService],
})
export class ProBonoModule {}
