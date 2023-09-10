import { Controller, Get, UseGuards, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator/get-user.decorator';

@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UserController {
  @Get('me')
  getMe(@GetUser() user: User, @Body() request: any) {
    console.log(user);
    console.log(request);
  }
}
