/**
 * Security Module
 */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SecurityService } from './security.service';
import { SecurityController } from './security.controller';
import { SecurityAuditLog } from '../../models/sequelize/SecurityAuditLog';

@Module({
  imports: [SequelizeModule.forFeature([SecurityAuditLog])],
  controllers: [SecurityController],
  providers: [SecurityService],
  exports: [SecurityService],
})
export class SecurityModule {}
