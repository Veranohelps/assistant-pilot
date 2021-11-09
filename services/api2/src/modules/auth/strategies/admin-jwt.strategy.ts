import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IAppRequest, IRequestAdminUser } from '../../common/types/request.type';
import { AuthService } from '../services/auth.service';
import { IJWTPayload } from '../types/jwt.types';

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy, 'admin') {
  constructor(configService: ConfigService, private authService: AuthService) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${configService.get('AUTH0_ADMIN_ISSUER_URL')}.well-known/jwks.json`,
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: configService.get('AUTH0_ADMIN_AUDIENCE'),
      issuer: `${configService.get('AUTH0_ADMIN_ISSUER_URL')}`,
      algorithms: ['RS256'],
      passReqToCallback: true,
    });
  }

  async validate(request: IAppRequest, jwtPayload: IJWTPayload): Promise<IRequestAdminUser> {
    return { jwtPayload };
  }
}
