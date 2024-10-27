import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'The user has been successfully created.' })
  @ApiResponse({ status: 409, description: 'Username or email already exists.' })
  @ApiBody({ type: CreateUserDto })
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.register(createUserDto);
  }
}
