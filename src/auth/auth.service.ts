import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './auth-credentials.dto';
import { UsersRepository } from './users.repository';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(AuthCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.usersRepository.createUser(AuthCredentialsDto);
  }

  async signIn({
    username,
    password,
  }: AuthCredentialsDto): Promise<{ accessToken: string }> {
    const user = await this.usersRepository.findOne({ username });

    if (user && (await compare(password, user.password))) {
      const payload: JwtPayload = { username };
      const accessToken: string = await this.jwtService.sign(payload);
      return { accessToken };
    }
    throw new UnauthorizedException('Please check your login credentials');
  }
}
