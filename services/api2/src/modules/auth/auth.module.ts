import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { AuthService } from './services/auth.service';
import { AdminJwtStrategy } from './strategies/admin-jwt.strategy';
import { PersonalJwtStrategy } from './strategies/personal-jwt.strategy';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' }), UserModule],
  providers: [AdminJwtStrategy, PersonalJwtStrategy, AuthService],
  exports: [PassportModule],
})
export class AuthModule {}
