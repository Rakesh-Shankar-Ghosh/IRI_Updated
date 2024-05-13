import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';

import Redis from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';

@Injectable()
export class UserGuard implements CanActivate {
  @InjectRedis() private readonly redis: Redis;

  async getRedisData(RedisKey: any): Promise<any> {
    const redisData = await this.redis.get(RedisKey);

    return redisData;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Explicitly return Promise<boolean>
    const request = context.switchToHttp().getRequest();

    // Check if Authorization header exists and contains a token
    if (request.headers.authorization) {
      // Extract the token (assuming it's in the format "Bearer <token>")
      const [, token] = request.headers.authorization.split(' ');

      // Check if token is present
      const result = await this.getRedisData(token);

      console.log(token);
      if (token && this.verifyToken(token) && result != null) {
        
        request.result=result;
        return true; // User is authenticated
      }
    }

    // User is not authenticated
    return false;
  }

  verifyToken(token: string): Boolean {
    try {
      // Verify the JWT token using the secret key
      const decoded = jwt.verify(token, 'usygfjhsdfjhbsdf');
      console.log('Decode value:', decoded)
      // return decoded; // Return the decoded payload
      return true;
    } catch (error) {
      // If verification fails (e.g., invalid token or signature), throw an error
      throw new Error('Invalid token');
    }
  }
}
