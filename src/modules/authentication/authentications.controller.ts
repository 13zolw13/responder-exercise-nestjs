import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './authentication.jwt.guard';
import { LocalAuthenticationGuard } from './authentication.local.guard';
import { AuthenticationsService } from './authentications.service';
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
