/**
 * EDiscovery Module
 */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { EDiscoveryService } from './ediscovery.service';
import { EDiscoveryController } from './ediscovery.controller';
import { Evidence } from '../../models/sequelize/Evidence';

@Module({
  imports: [SequelizeModule.forFeature([Evidence])],
  controllers: [EDiscoveryController],
  providers: [EDiscoveryService],
  exports: [EDiscoveryService],
})
export class EDiscoveryModule {}
