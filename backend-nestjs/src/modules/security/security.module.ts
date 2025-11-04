/**
 * Security Module
 */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SecurityService } from './security.service';
import { SecurityController } from './security.controller';
import { SecurityAudit } from '../../models/sequelize/SecurityAudit';

@Module({
  imports: [SequelizeModule.forFeature([SecurityAudit])],
  controllers: [SecurityController],
  providers: [SecurityService],
  exports: [SecurityService],
})
export class SecurityModule {}
