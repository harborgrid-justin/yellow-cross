/**
 * SocialSecurity Module
 */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SocialSecurityService } from './social-security.service';
import { SocialSecurityController } from './social-security.controller';
import { SocialSecurityMatter } from '../../models/sequelize/SocialSecurityMatter';

@Module({
  imports: [SequelizeModule.forFeature([SocialSecurityMatter])],
  controllers: [SocialSecurityController],
  providers: [SocialSecurityService],
  exports: [SocialSecurityService],
})
export class SocialSecurityModule {}
