import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { AuthEventHandler } from './events/event-handlers/auth.event-handler';
import { AuthService } from './services/auth.service';
import { AdminJwtStrategy } from './strategies/admin-jwt.strategy';
import { PersonalJwtStrategy } from './strategies/personal-jwt.strategy';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' }), UserModule],
  providers: [
    AdminJwtStrategy,
    PersonalJwtStrategy,
    AuthService,

    // Event handlers
    AuthEventHandler,
  ],
  exports: [PassportModule],
})
export class AuthModule {}
