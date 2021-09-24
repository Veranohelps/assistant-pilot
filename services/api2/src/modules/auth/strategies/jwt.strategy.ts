import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IAppRequest, IRequestUser } from '../../common/types/request.type';
import { AuthService } from '../services/auth.service';
import { IJWTPayload } from '../types/jwt.types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService, private authService: AuthService) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${configService.get('AUTH0_ISSUER_URL')}.well-known/jwks.json`,
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: configService.get('AUTH0_AUDIENCE'),
      issuer: `${configService.get('AUTH0_ISSUER_URL')}`,
      algorithms: ['RS256'],
      passReqToCallback: true,
    });
  }

  async validate(request: IAppRequest, jwtPayload: IJWTPayload): Promise<IRequestUser> {
    const userData = await this.authService.registerOrGetUser(jwtPayload.sub);

    request.rctx = { user: { jwtPayload, userData } };

    return { jwtPayload, userData };
  }
}
