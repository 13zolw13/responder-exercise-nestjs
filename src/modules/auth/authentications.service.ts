import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
@Injectable()
export class AuthenticationsService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async validateUser(username: string, pass: string): Promise<User> {
    const user = await this.usersService.findOneByUsername(username);
    if (user && (await argon2.verify(user.password, pass))) {
      return user;
    }
    return null;
  }
  async login(user: any): Promise<any> {
    const payload = { username: user.username, sub: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }

  async getPayload(access_token: string) {
    const userFromPayload = await this.jwtService.decode(access_token);
    return userFromPayload;
  }
}
