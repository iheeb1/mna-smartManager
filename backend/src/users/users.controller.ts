import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { CreateUserDto, GetUsersDto } from './dto/user.dto';

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

@Controller('api/SMUser')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async post(@Body() payload: RequestPayload): Promise<WSManagerWebAPIResult> {
    try {
      const { ReqType, ReqObject } = payload;

      switch (ReqType) {
        case 'SaveUserDetails': {
          const userDto: CreateUserDto = ReqObject;
          
          if (!userDto) {
            return {
              success: false,
              code: -1,
              message: 'Failed',
              data: null,
            };
          }

          const savedUser = await this.usersService.save(userDto);
          if(!!savedUser){
            savedUser.password = '';
          }
          
          return {
            success: true,
            code: 200,
            message: 'Success',
            data: savedUser,
          };
        }

        case 'GetUsersList': {
          if (!ReqObject) {
            return {
              success: false,
              code: -1,
              message: 'Failed',
              data: null,
            };
          }

          const searchParams: GetUsersDto = {
            ...ReqObject,
            itemsPerPage: ReqObject.ItemsPerPage || 30,
            pageNumber: ReqObject.PageNumber || 0,
          };

          const [users, total] = await this.usersService.findAll(searchParams);

          // Clear passwords from all users
          users.forEach(user => {
            user.password = '';
          });

          return {
            success: true,
            code: 200,
            message: 'Success',
            data: users,
          };
        }

        case 'GetUserDetails': {
          const userId = ReqObject?.UserId;
          
          if (!userId) {
            return {
              success: false,
              code: -1,
              message: 'Failed',
              data: null,
            };
          }

          const user = await this.usersService.findById(userId);

          if (!user) {
            return {
              success: false,
              code: -1,
              message: 'Failed',
              data: null,
            };
          }

          return {
            success: true,
            code: 200,
            message: 'Success',
            data: user,
          };
        }

        case 'DeleteUser': {
          const userId = ReqObject?.UserId;

          if (!userId) {
            return {
              success: false,
              code: -1,
              message: 'Failed',
              data: null,
            };
          }

          await this.usersService.remove(userId);

          return {
            success: true,
            code: 200,
            message: 'Success',
            data: null,
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