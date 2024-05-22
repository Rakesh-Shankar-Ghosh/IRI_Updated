import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from '../../dto/create-user.dto'; // Import CreateUserDto

import { User } from '../../entity/user.entity'; // Import User entity
import { UpdateUserDto } from '../../dto/update-user.dto';
import { UpdatePasswordUserDto } from '../../dto/updatePassword-user.dto';
import { LoginUserDto } from '../../dto/login-user.dto';

import { UserGuard } from '../../middleware/user.gurd';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signup')
  async signUp(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.signUp(createUserDto);
  }

  @Get('/getall-users')
  async getAllUsers(): Promise<User> {
    return this.userService.getAllUsers();
  }

  @Get('/get-user/:id')

  async findUserById(@Param('id') id: string): Promise<any> {
    return this.userService.findUserById(id);
  }

  @Delete('/delete-user/:id')
  async deleteuserById(@Param('id') id: string): Promise<any> {
    return this.userService.deleteuserById(id);
  }

  @Put('/update-user/:id')
  async updateUserById(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.updateUserById(parseInt(id, 10), updateUserDto); // Parse id to number
  }

  @Put('/update-password/:id')
  async updatePasswordById(
    @Param('id') id: string,
    @Body() updatePasswordUserDto: UpdatePasswordUserDto,
  ): Promise<User> {
    return this.userService.updatePasswordById(
      parseInt(id, 10),
      updatePasswordUserDto,
    ); // Parse id to number
  }
  @Post('/login')
  async loginUser(@Body() loginUserDto: LoginUserDto): Promise<any> {
    return this.userService.loginUser(loginUserDto);
  }

  @Post('/logout')
  @UseGuards(UserGuard)
  async logOut(@Req() request: any): Promise<any> {
    return this.userService.logOut(request);
  }

  @Get('/auth-check')
  @UseGuards(UserGuard)
  async authCheck(@Req() request: any): Promise<any> {
    return this.userService.authCheck(request);
  }

  @Post('/get-login-user')
  async getUserInforFromRedis(@Body() accessToken: { accessToken: string }): Promise<any> {
    return this.userService.getUerInforFromRedis(accessToken);
  }

  @Post('/request-refresh-token')
  async requestRefreshToken(@ Body() accessToken: { accessToken: string }): Promise<any> {
    return this.userService.requestRefreshingToken(accessToken);
  }



}
