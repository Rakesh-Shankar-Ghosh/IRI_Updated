import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '.././../entity/user.entity';
import { CreateUserDto } from '../../dto/create-user.dto'; // Import CreateUserDto

import { UpdatePasswordUserDto } from '../../dto/updatePassword-user.dto';

import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from 'src/dto/update-user.dto';
import { LoginUserDto } from 'src/dto/login-user.dto';

import * as jwt from 'jsonwebtoken';

import Redis from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';

@Injectable()
export class UserService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRedis() private readonly redis: Redis,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<any> {
    try {
      // Check if a user with the same email already exists
      const existingUser = await this.userRepository.findOne({
        where: { email: createUserDto.email },
      });
      if (existingUser) {
        throw new HttpException(
          'Email already registered',
          HttpStatus.CONFLICT,
        );
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      // Create a new user entity with hashed password
      const user = this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
      });

      // Save the user
      await this.userRepository.save(user);
      const access_token = this.generateAccessToken(user.id);

      return {
        statusCode: HttpStatus.CREATED,
        message: 'User created successfully',
        user,
        access_token,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_GATEWAY,
        success: true,
        error,
      };
    }
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<any> {
    try {
      // Find user by email
      const getUser = await this.userRepository.findOne({
        where: { email: loginUserDto.email },
      });
      if (!getUser) {
        return {
          statusCode: HttpStatus.GONE,
          message: 'User Not Found',
          success: false,
        };
      }

      // Check if password matches
      const isPasswordValid = await bcrypt.compare(
        loginUserDto.password,
        getUser.password,
      );
      if (!isPasswordValid) {
        return {
          statusCode: HttpStatus.NOT_ACCEPTABLE,
          message: 'Invalid password',
          success: false,
        }; // Invalid password
      }

      const { password, ...user } = getUser;
      const userData = JSON.stringify({
        user,
      });
        // Generate JWT token
        // const accessToken = this.generateAccessToken(Number(getUser.id));

      const {accessToken, refreshToken} = await this.generateTokens(getUser.id);

      // await this.redis.set(accessToken, userData, 'EX', 90000);
      await this.redis.setex(`DataPair:${accessToken}`, 300, userData);
      await this.redis.setex(`RefreshPair:${accessToken}`, 90000, refreshToken);


      return {
        statusCode: HttpStatus.OK,
        message: `Login successfully done`,
        success: true,
        accessToken,
        user,
        refreshToken
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.NOT_ACCEPTABLE,
        success: false,
        message: error.message,
      };
    }
  }

  async getAllUsers(): Promise<any> {
    try {
      const users = await this.userRepository.find();
      return {
        statusCode: HttpStatus.OK,
        message: 'Users retrieved successfully',
        users,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.MISDIRECTED,
        success: false,
        message: error.message,
      };
    }
  }

  async findUserById(id: string): Promise<any> {
    const userId = Number(id);
    try {
      const getUser = await this.userRepository.findOne({
        where: { id: userId },
      });
      if (!getUser) {
        throw new NotFoundException('User not found'); //single lile error handling
      }
      const { password, ...user } = getUser;
      return {
        statusCode: HttpStatus.OK,
        message: 'User retrieved successfully',
        success: true,
        user,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.NOT_ACCEPTABLE,
        success: false,
        message: error.message,
      };
    }
  }

  async deleteuserById(id: string): Promise<any> {
    const userId = Number(id);
    try {
      const userToDelete = await this.userRepository.findOne({
        where: { id: userId },
      });
      if (!userToDelete) {
        throw new NotFoundException('User not found');
      }

      await this.userRepository.remove(userToDelete);

      return {
        statusCode: HttpStatus.OK,
        message: 'User deleted successfully',
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.NOT_ACCEPTABLE,
        success: false,
        message: error.message,
      };
    }
  }

  async updateUserById(id: number, updateUserDto: UpdateUserDto): Promise<any> {
    try {
      const userId = Number(id);
      const getUser = await this.userRepository.findOne({
        where: { id: userId },
      });
      if (!getUser) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      // Update user fields based on the provided DTO
      for (const [key, value] of Object.entries(updateUserDto)) {
        // Check if the field exists and is not confirmPassword or empty
        if (value !== undefined && value !== '') {
          getUser[key] = value;
        }
      }

      // Save the updated user
      const updatedUser = await this.userRepository.save(getUser);
      const { password, ...user } = updatedUser;

      return {
        statusCode: HttpStatus.OK,
        message: 'User updated successfully',
        success: true,
        user,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.NOT_ACCEPTABLE,
        success: false,
        message: error.message,
      };
    }
  }

  async updatePasswordById(
    id: number,
    updatePasswordDto: UpdatePasswordUserDto,
  ): Promise<any> {
    try {
      const userId = Number(id);
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      // Check if the old password matches
      const oldPasswordMatches = await bcrypt.compare(
        updatePasswordDto.oldPassword,
        user.password,
      );
      if (!oldPasswordMatches) {
        throw new HttpException(
          'Old password does not match',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Check if the new password and confirm password match
      if (updatePasswordDto.password !== updatePasswordDto.confirmPassword) {
        throw new HttpException(
          'Passwords do not match',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(updatePasswordDto.password, 10);

      // Update the user's password
      user.password = hashedPassword;

      // Save the updated user
      const updatedUser = await this.userRepository.save(user);

      return {
        statusCode: HttpStatus.OK,
        message: 'Password updated successfully',
        success: true,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.NOT_ACCEPTABLE,
        success: false,
        message: error.message,
      };
    }
  }

  async logOut(request: any): Promise<any> {
    try {
      const accessToken = request.accessToken;
      
      const result = request.result;


      await this.redis.del(`DataPair:${accessToken}`);
      await this.redis.del(`RefreshPair:${accessToken}`);

      
      return {
        success: true,
        message: 'Successfully Logout',
        
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async authCheck(request: any): Promise<any> {
    try {
      const  {user}  = request.data;
      const accessToken = request.accessToken;
     
      if (user) {
        return {
          success: true,
          message: 'Auth Checked Successfully',
          user,
          accessToken
        };
      }
      return {
        success: false,
        message: 'Authentication failed',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  verifyToken(token: string, secret: string): any {
    try {
      const decoded = jwt.verify(token, secret);

      if (decoded) {
        return decoded;
      }
      return {
        message: 'Token Verification failed!!!',
      };
    } catch (error) {
      return {
        message: error.message,
      };
    }
  }

  generateAccessToken(userId: number): string {
    return this.jwtService.sign(
      { userId },
      {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: '15m',
      },
    );
  }

  generateRefreshToken(userId: number): string {
    return this.jwtService.sign(
      { userId },
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      },
    );
  }

  async generateTokens(userId: number): Promise<{ accessToken: string, refreshToken: string }> {
    const accessToken = this.generateAccessToken(userId);
    
    const refreshToken = await new Promise<string>((resolve) => {
      setTimeout(() => {
        const token = this.generateRefreshToken(userId);
        resolve(token);
      }, 1500);
    });

    return { accessToken, refreshToken };
  }


  async getUerInforFromRedis(tokenObject: { accessToken: string }): Promise<any> {
    try {
      // Destructure the token from the tokenObject
      const { accessToken } = tokenObject;

      // console.log('GETING TOKWN', token);
      // Retrieve the user information from Redis using the token
      const getUser = await this.redis.get(`DataPair:${accessToken}`);
      // console.log('getting data', getUser);

      if (!getUser) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          success: false,
          message: 'Not found user data in redis',
        };
      }

      // Parse the user information
      const { user } = JSON.parse(getUser);

      return {
        statusCode: HttpStatus.OK,
        success: true,
        message: 'User retrieved from Redis',
        user,
        accessToken,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.SERVICE_UNAVAILABLE,
        success: false,
        message: error.message,
      };
    }
  }


  async requestRefreshingToken(tokenObject: { accessToken: string }): Promise<any> {
    try {
      // Destructure the token from the tokenObject
      const { accessToken } = tokenObject;

      const refreshToken = await this.redis.get(`RefreshPair:${accessToken}`);
      const {userId} = this.verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET)
      if(!refreshToken || !userId)
        {
          return {
            statusCode: HttpStatus.FORBIDDEN,
            message: "RefreshToken not found",
            success:false
          }
        }
        const newAccessToken = this.generateAccessToken(userId);
        if(!newAccessToken)
          {
            return {
              statusCode: HttpStatus.FORBIDDEN,
              message: "Access Token Not created",
              success:false
            }
          }

        await this.redis.rename(`DataPair:${accessToken}`, `DataPair:${newAccessToken}`);
        await this.redis.rename(`RefreshPair:${accessToken}`, `RefreshPair:${newAccessToken}`);


      return {
        statusCode: HttpStatus.OK,
        success: true,
        message: 'Token has refreshed and new access Token given',
        newAccessToken,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.SERVICE_UNAVAILABLE,
        success: false,
        message: error.message,
      };
    }
  }


  async dummyTest(): Promise<any>
  {
    return 'Dummy test';
  }


}
