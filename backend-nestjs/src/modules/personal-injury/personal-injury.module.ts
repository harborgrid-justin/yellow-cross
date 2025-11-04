/**
 * PersonalInjury Module
 */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PersonalInjuryService } from './personal-injury.service';
import { PersonalInjuryController } from './personal-injury.controller';
import { PersonalInjuryCase } from '../../models/sequelize/PersonalInjuryCase';

@Module({
  imports: [SequelizeModule.forFeature([PersonalInjuryCase])],
  controllers: [PersonalInjuryController],
  providers: [PersonalInjuryService],
  exports: [PersonalInjuryService],
})
export class PersonalInjuryModule {}
