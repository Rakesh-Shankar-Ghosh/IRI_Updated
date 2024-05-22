import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';



import Redis from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class UserGuard implements CanActivate {
  @InjectRedis() private readonly redis: Redis;
  @Inject() private readonly userService: UserService;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (request.headers.authorization) {
      const [, accessToken] = request.headers.authorization.split(' ');

      const result = 
        await this.userService.getUerInforFromRedis({accessToken}); // geting data from redis
 
      
      const { userId } = this.userService.verifyToken(
        accessToken,
        process.env.JWT_ACCESS_SECRET,
      );
      // console.log(userId, result.user, accessToken);

      if (accessToken && userId && result != null) {
        request.accessToken = accessToken;
        request.data = result;

        return true;
      }
    }

    return false;
  }
}
