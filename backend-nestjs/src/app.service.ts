import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Yellow Cross NestJS - Enterprise Law Firm Management Platform';
  }
}
