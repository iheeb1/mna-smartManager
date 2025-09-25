import { 
    Controller, 
    Request, 
    Post, 
    UseGuards, 
    Body, 
    Get,
    HttpCode,
    HttpStatus 
  } from '@nestjs/common';
  import { AuthService } from './auth.service';
  import { LocalAuthGuard } from './guards/local-auth.guard';
  import { JwtAuthGuard } from './guards/jwt-auth.guard';
  
  @Controller('auth')
  export class AuthController {
    constructor(private authService: AuthService) {}
  
    @UseGuards(LocalAuthGuard)
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Request() req) {
      return this.authService.login(req.user);
    }
  
    @Post('register')
    async register(@Body() body: { username: string; password: string }) {
      return this.authService.register(body.username, body.password);
    }
  
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
      return req.user;
    }
  }
  