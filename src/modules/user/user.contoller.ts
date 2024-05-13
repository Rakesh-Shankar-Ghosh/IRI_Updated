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

  @Get('/dummyTest')
  async dummyTest(): Promise<any> {
    return this.userService.dummyTest();
  }

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

  @Get('/test')
  async testRedis(): Promise<any> {
    return this.userService.TestRedis();
  }

  //THE PROVE OF REDIS DATA AND VALIDATION FOR 5 MINIT
  @Get('/protected')
  @UseGuards(UserGuard)
  async getProfile(@Req() request: any): Promise<any> {
    return this.userService.getProfile(request);
  }

  @Post('/refresh-token')
  @UseGuards(UserGuard)
  async generateRefreshToken(token: string): Promise<any> {
    return this.userService.generateRefreshToken(token);
  }

  // UseGuard is a auth cheker if we use this before any route
  // then first it checks it has token in its headers or not
  // if token abiable then then cheks it valid or not by jwt
  // if vaid by jwt then it pass to redis as key, if redis has the same key then it retrive infor from redis
  // and finally give permission to next service method

  //example.. if we use guard top of getusebyId  route the we cant fetch it but
  // if we login in and get token and then set to header Authorization, then we access the route
}
