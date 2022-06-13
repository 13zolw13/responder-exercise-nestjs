import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { LocalAuthenticationGuard } from './authentication.local.guard';
import { AuthenticationsService } from './authentications.service';
@Controller('login')
export class AuthenticationsController {
  constructor(
    private readonly authenticationsService: AuthenticationsService,
  ) {}
  @Get()
  async loginPage() {
    return 'login';
  }

  @UseGuards(LocalAuthenticationGuard)
  @Post()
  async login(@Request() req) {
    return req.user;
  }
}
