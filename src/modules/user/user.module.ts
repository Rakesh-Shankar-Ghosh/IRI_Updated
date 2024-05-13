import { UserGuard } from './../../middleware/user.gurd';
// user.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.contoller';
import { UserService } from './user.service';
import { User } from './../../entity/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from '@nestjs-modules/ioredis';


@Module({
  imports: [
    TypeOrmModule.forFeature([User]),

    JwtModule.register({
      secret: "usygfjhsdfjhbsdf", // Replace with  own secret key
      signOptions: { expiresIn: '1d' }, // Set the token expiry time// dont care the time because we are using redish data for only 5 minit
    }),

    RedisModule.forRoot({
      type: 'single',
      url: process.env.REDIS_URL
    }),

    
  ],
  

  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
