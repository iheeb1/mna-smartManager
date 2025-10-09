import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { EncryptionUtil } from '../common/encryption.util';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    if (!username || !password) {
      return null;
    }

    const encryptedPassword = EncryptionUtil.encrypt(password);
    
    const user = await this.usersService.findByUsernameAndPassword(
      username,
      encryptedPassword,
    );

    if (user) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
    const payload = { username: user.userName };
    
    const token = this.jwtService.sign(payload);
    
    return {
      ...user,
      password: '', 
      token,
    };
  }

  async convertPassword(password: string): Promise<string> {
    return EncryptionUtil.encrypt(password);
  }
}