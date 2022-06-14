import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LocalAuthenticationGuard } from './guards/authentication.local.guard';
import { AuthenticationsService } from './authentications.service';
@ApiTags('Login')
@Controller()
export class AuthenticationsController {
  constructor(
    private readonly authenticationsService: AuthenticationsService,
  ) {}
  @Get('/login')
  async loginPage() {
    return 'login';
  }

  @UseGuards(LocalAuthenticationGuard)
  @Post('/login')
  async login(@Request() req) {
    return this.authenticationsService.login(req.user);
  }
}
