/**
 * Communication Module
 */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CommunicationService } from './communication.service';
import { CommunicationController } from './communication.controller';
import { Message } from '../../models/sequelize/Message';

@Module({
  imports: [SequelizeModule.forFeature([Message])],
  controllers: [CommunicationController],
  providers: [CommunicationService],
  exports: [CommunicationService],
})
export class CommunicationModule {}
