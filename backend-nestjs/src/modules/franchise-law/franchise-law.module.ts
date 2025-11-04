/**
 * FranchiseLaw Module
 */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { FranchiseLawService } from './franchise-law.service';
import { FranchiseLawController } from './franchise-law.controller';
import { FranchiseLawMatter } from '../../models/sequelize/FranchiseLawMatter';

@Module({
  imports: [SequelizeModule.forFeature([FranchiseLawMatter])],
  controllers: [FranchiseLawController],
  providers: [FranchiseLawService],
  exports: [FranchiseLawService],
})
export class FranchiseLawModule {}
