import { Repository } from 'typeorm';

import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import { LoginDto, RegisterDto } from '../data/dto';
import { UserEntity } from '../data/entities';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  public async register(registerDto: RegisterDto): Promise<any> {
    try {
      const user = this.userRepository.create(registerDto);
      await this.userRepository.save(user);

      // generate and sign token
      const token = this.createToken(user);

      return { user: { ...user.toJSON(), token } };
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username has already been taken.');
      }
      throw new InternalServerErrorException();
    }
  }

  public async login({ email, password }: LoginDto): Promise<any> {
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      const isValid = await user.comparePassword(password);

      if (!isValid) {
        throw new UnauthorizedException('Invalid credentials.');
      }

      // generate and sign token
      const token = this.createToken(user);

      return { user: { ...user.toJSON(), token } };
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials.');
    }
  }

  public createToken(user: UserEntity): string {
    const jwtPayload = { id: user.id, username: user.username };
    return this.jwtService.sign(jwtPayload);
  }
}
