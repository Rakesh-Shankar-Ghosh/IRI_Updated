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


  async dummyTest(): Promise<String> {

    return 'Dummy test';
  }

  async getProfile(request: any): Promise<any> {
    // Access the result from the request object
    const result = request.result;
    console.log('Calling from here', result); // Print the result
    return 'Happy Birthday';
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<any> {
    // Find user by email
    const user = await this.userRepository.findOne({
      where: { email: loginUserDto.email },
    });
    if (!user) {
      return {
        statusCode: HttpStatus.GONE,
        message: 'User Not Found',
        success:false
      };
    }

    // Check if password matches
    const isPasswordValid = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      return {
        statusCode: HttpStatus.GONE,
        message: 'Invalid password',
        success:false
      }; // Invalid password
    }

    // Generate JWT token
    const token = this.generateAccessToken(Number(user.id));

    const { id, email, name, country, profession } = user; // remove password from body before  to go redish

    const RedisData = JSON.stringify({ id, email, name, country, profession });
    const RedisKey = token;

    await this.redis.set(RedisKey, RedisData, (err) => {
      //we can log eror hetr
    });
    await this.redis.expire(RedisKey, 3000); //300seeec = 5 mnnit
    const redisUserInfoData = await this.redis.get(RedisKey); //if needed then send
    

    return {
      statusCode: HttpStatus.OK,
      success: true,
      token,
      user
      // redisUserInfoData, // (optional for now )it will be again Parse to JSON when i catch it in frontend
    };
  }

  verifyToken(token: string): any {
    try {
      // Verify the JWT token using the secret key
      const decoded = jwt.verify(token, 'usygfjhsdfjhbsdf');

      console.log(decoded);
      if(decoded){
        return decoded;
      }
      return 'not verfied';
      
    } catch (error) {
      // If verification fails (e.g., invalid token or signature), throw an error
      throw new Error('Invalid token');
    }
  }

  generateAccessToken(userId: number): string {
    // Generate JWT token with user ID as payload and expiry time
    const payload = { userId };
    return this.jwtService.sign(payload, { expiresIn: '1d' });
  }

  async generateRefreshToken(token: string): Promise<any> {
    // Generate JWT token with user ID as payload and expiry time
    const {userId} = this.verifyToken(token);

    const redisUserInfoData = await this.redis.get(token)

    if((userId && redisUserInfoData) !=null){
      const refreshToken = this.generateAccessToken(userId);
      await this.redis.set(refreshToken, JSON.stringify(redisUserInfoData));
      await this.redis.expire(refreshToken, 3000);

      return {
        statusCode: HttpStatus.OK,
        success: true,
        refreshToken
        // redisUserInfoData, // (optional for now )it will be again Parse to JSON when i catch it in frontend
      };

    }

    else{ return 'vaerification failed'}
  }

  //done
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
      const newUser = this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
      });

      // Save the user
      await this.userRepository.save(newUser);
      const access_token = this.generateAccessToken(newUser.id);
  
      return {
        statusCode: HttpStatus.CREATED,
        message: 'User created successfully',
        user: newUser,
        access_token
      };
    } catch (error) {
      if (error instanceof HttpException) {
        
        return {
          statusCode: HttpStatus.BAD_GATEWAY,
          success:true,
          error
        };
      } else {
        // Handle other errors
        throw new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
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
        success:false,
        error
      };
    }
  }

  async findUserById(id: string): Promise<any> {
    const userId = Number(id);
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'User retrieved successfully',
        user,
      };
    } catch (error) {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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
      // Handle potential errors (e.g., database errors)
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateUserById(id: number, updateUserDto: UpdateUserDto): Promise<any> {
    try {
      const userId = Number(id);
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      // Update user fields based on the provided DTO
      for (const [key, value] of Object.entries(updateUserDto)) {
        // Check if the field exists and is not confirmPassword or empty
        if (value !== undefined && value !== '') {
          user[key] = value;
        }
      }

      // Save the updated user
      const updatedUser = await this.userRepository.save(user);

      return {
        statusCode: HttpStatus.OK,
        message: 'User updated successfully',
        updatedUser: updatedUser,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error; // Re-throw HttpException
      } else {
        throw new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
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
        updatedUser: updatedUser,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error; // Re-throw HttpException
      } else {
        throw new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async TestRedis(): Promise<any> {
    await this.redis.set('name', 'Ashoke Kumar Ghosh', (err) => {
      console.log(err);
    });
    await this.redis.expire('name', 50);
    const redisData = await this.redis.get('name');
    return { redisData };
  }



}
