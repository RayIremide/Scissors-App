import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './authService';
import { GoogleStrategy } from './google.strategy';
import { AuthController } from './authController';

@Module({
  imports: [PassportModule],
  providers: [AuthService, GoogleStrategy],
  controllers: [AuthController],
})
export class AuthModule {}