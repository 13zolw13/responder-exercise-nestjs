import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../../decorators/publicSIte.decorator';
import { AuthenticationsService } from './authentications.service';
import { LocalAuthenticationGuard } from './guards/authentication.local.guard';
@ApiTags('Login')
@Public()
@Controller()
export class AuthenticationsController {
  constructor(
    private readonly authenticationsService: AuthenticationsService,
  ) {}

  @UseGuards(LocalAuthenticationGuard)
  @Post('/login')
  async login(@Request() req) {
    return this.authenticationsService.login(req.user);
  }
}
