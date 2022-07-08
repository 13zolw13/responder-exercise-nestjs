import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CheckPolicies } from '../../decorators/checkRites.decorator';
import { Public } from '../../decorators/publicSIte.decorator';
import { AuthByIdGuard } from '../auth/authorizedById.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Public()
  @Post('/signup')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(@Request() req) {
    console.log(req?.user);
    return this.usersService.findAll();
  }

  @Get(':userId')
  findOne(@Param('userId') userId: string) {
    return this.usersService.findOne(userId);
  }

  @Patch(':userId')
  @UseGuards(AuthByIdGuard)
  async update(
    @Param('userId') userId: string,
    @Request() req,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    console.log(req?.user);
    return await this.usersService.update(updateUserDto);
  }

  @Delete(':userId')
  @UseGuards(AuthByIdGuard)
  remove(@Param('userId') userId: string) {
    return this.usersService.remove(userId);
  }
}
