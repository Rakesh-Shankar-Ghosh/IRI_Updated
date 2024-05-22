import { UserGuard } from './../../middleware/user.gurd';
// user.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.contoller';
import { UserService } from './user.service';
import { User } from './../../entity/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from '@nestjs-modules/ioredis';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the ConfigModule global, no need to import it in other modules
    }),

    TypeOrmModule.forFeature([User]),

    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: process.env.JWT_DEFAULT_SECRET,
        signOptions: { expiresIn: '10m' },
      }),
    }),

    RedisModule.forRoot({
      type: 'single',
      url: process.env.REDIS_URL,
    }),
  ],

  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
