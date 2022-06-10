import { Controller } from '@nestjs/common';
import { AuthenticationsService } from './authentications.service';

@Controller('login')
export class AuthenticationsController {
  constructor(
    private readonly authenticationsService: AuthenticationsService,
  ) {}
}
