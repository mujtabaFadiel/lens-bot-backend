import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.stratgey';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'SecretKey', //هذا هو "المفتاح السري" (Secret Key) الذي يُستخدم لتشفير وتوقيع الـ Token لضمان عدم تزويره من قبل الهكرز. (تأكد أن هذه القيمة مخفية في ملف .env).
        signOptions: { expiresIn: '1h' },
      })
    })],
  exports: [JwtStrategy, PassportModule]
})
export class AuthModule { }
