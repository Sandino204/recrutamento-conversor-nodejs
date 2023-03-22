import {
    Injectable,
    UnauthorizedException,
    ConflictException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { AuthCredentialsDto } from './dto/auth-credentials.dto';
  import { AuthCreateCredentialsDto } from './dto/auth-create-credentials.dto';
  import * as bcrypt from 'bcrypt';
  import { JwtService } from '@nestjs/jwt';
  import { JwtPayload } from './interfaces/jwt-payload.interface';
  import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import 'dotenv/config';
  
  @Injectable()
  export class AuthService {
    constructor(
      @InjectRepository(User)
      private usersRepository: Repository<User>,
      private jwtService: JwtService,
    ) {}
  
    public async getUserByEmail(email: string): Promise<User> {
      return await this.usersRepository.findOne({
        where: {
          email,
        }
      })
    }


    async createUser(input: AuthCreateCredentialsDto): Promise<void> {
      const { email, password, name } = input;
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
  
      await this.usersRepository.save({
        email,
        name,
        password: hashedPassword,
      });
    }
  

    async signUp(payload: AuthCreateCredentialsDto): Promise<void> {
      const found = await this.getUserByEmail(payload.email);
      if (found) {
        throw new ConflictException('Email already exists');
      }
      await this.createUser(payload);
    }
  
    async signIn(
      authCredentialsDto: AuthCredentialsDto,
    ): Promise<{ accessToken: string }> {
      const { email, password } = authCredentialsDto;
      const user = await this.getUserByEmail(email);
      if (user && (await bcrypt.compare(password, user.password))) {
        const payload: JwtPayload = { email };
        const accessToken = this.jwtService.sign(payload, {
          privateKey: process.env.JWT_SECRET ? process.env.JWT_SECRET : 'mock'
        });
        return { accessToken };
      } else {
        throw new UnauthorizedException('Please check your login credentials');
      }
    }
  }