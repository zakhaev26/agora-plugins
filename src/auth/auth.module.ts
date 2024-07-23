import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants/jwt-constants';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
@Module({
  controllers: [AuthController],
  exports: [],
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: {
        expiresIn: '365d',
      },
    }),
  ],
  providers: [AuthService],
})
export class AuthModule {}
