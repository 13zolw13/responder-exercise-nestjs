import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategyMock extends PassportStrategy(Strategy) {
  public static SECRET_MOCK = 'secret';
  constructor() {
    super({
      secretOrKey: JwtStrategyMock.SECRET_MOCK,

      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  public async validate(payload: any) {
    return {
      userId: payload.sub,
      username: payload.username,
    };
  }
}
