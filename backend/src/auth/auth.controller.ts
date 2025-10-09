import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

interface WSManagerWebAPIResult {
  success: boolean;
  code: number;
  message: string;
  data: any;
}

interface RequestPayload {
  ReqType: string;
  ReqObject: any;
}

@Controller('api/SMUserLogin')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post()
  async post(@Body() payload: RequestPayload): Promise<WSManagerWebAPIResult> {
    try {
      const { ReqType, ReqObject } = payload;

      switch (ReqType) {
        case 'CheckUserLogin': {
          const { UserName, Password } = ReqObject;

          if (!UserName || !Password) {
            return {
              success: false,
              code: -1,
              message: 'Missing UserName Or Password',
              data: null,
            };
          }

          const user = await this.authService.validateUser(UserName, Password);
          
          if (!user) {
            return {
              success: false,
              code: -1,
              message: 'User is not exist',
              data: null,
            };
          }

          const userWithToken = await this.authService.login(user);

          return {
            success: true,
            code: 200,
            message: 'Success',
            data: userWithToken,
          };
        }

        case 'ConvertPass': {
          const { Password } = ReqObject;
          const encryptedPassword = await this.authService.convertPassword(Password);

          return {
            success: true,
            code: 200,
            message: 'Success',
            data: encryptedPassword,
          };
        }

        default:
          return {
            success: false,
            code: -1,
            message: 'Failed',
            data: null,
          };
      }
    } catch (error) {
      return {
        success: false,
        code: -1,
        message: error.message,
        data: null,
      };
    }
  }
}