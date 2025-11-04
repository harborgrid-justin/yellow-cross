/**
 * WhiteCollarCrime Module
 */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { WhiteCollarCrimeService } from './white-collar-crime.service';
import { WhiteCollarCrimeController } from './white-collar-crime.controller';
import { WhiteCollarCrimeMatter } from '../../models/sequelize/WhiteCollarCrimeMatter';

@Module({
  imports: [SequelizeModule.forFeature([WhiteCollarCrimeMatter])],
  controllers: [WhiteCollarCrimeController],
  providers: [WhiteCollarCrimeService],
  exports: [WhiteCollarCrimeService],
})
export class WhiteCollarCrimeModule {}
