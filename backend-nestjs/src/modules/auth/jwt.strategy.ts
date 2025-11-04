/**
 * JWT Strategy for Passport
 */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../../models/sequelize/User';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectModel(User)
    private userModel: typeof User,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('app.jwt.secret'),
    });
  }

  async validate(payload: any) {
    const user = await this.userModel.findByPk(payload.sub);
    
    if (!user || user.status !== 'Active') {
      throw new UnauthorizedException('User not found or inactive');
    }
    
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      roles: payload.roles || [payload.role],
    };
  }
}
