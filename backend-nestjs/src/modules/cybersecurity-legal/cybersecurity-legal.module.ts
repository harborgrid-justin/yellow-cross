/**
 * CybersecurityLegal Module
 */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CybersecurityLegalService } from './cybersecurity-legal.service';
import { CybersecurityLegalController } from './cybersecurity-legal.controller';
import { CybersecurityLegalMatter } from '../../models/sequelize/CybersecurityLegalMatter';

@Module({
  imports: [SequelizeModule.forFeature([CybersecurityLegalMatter])],
  controllers: [CybersecurityLegalController],
  providers: [CybersecurityLegalService],
  exports: [CybersecurityLegalService],
})
export class CybersecurityLegalModule {}
