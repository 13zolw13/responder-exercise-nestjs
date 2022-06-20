import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import { Repository } from 'typeorm/repository/Repository';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AuthenticationsService } from './authentications.service';
import { JwtStrategy } from './strategies/authentication.jwt.strategy';

const MockUsers = async (): Promise<User> => {
  const user = new User();
  user.id = 'id123';
  user.username = 'testUser';
  user.email = 'id@mail.com';
  user.password = await argon2.hash('password');
  return user;
};
describe('AuthenticationsService', () => {
  let service: AuthenticationsService;
  let repositoryUser: Repository<User>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secretOrPrivateKey: 'secret',
        }),
      ],
      providers: [
        AuthenticationsService,
        UsersService,
        JwtStrategy,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn().mockImplementation(async () => {
              return await MockUsers();
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AuthenticationsService>(AuthenticationsService);
    repositoryUser = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should validate user ', async () => {
    expect(repositoryUser).toBeDefined();
    expect(service.validateUser).toBeDefined();
    const response = await service.validateUser('testUser', 'password');
    expect(response).toBeDefined();
    expect(response.username).toBe('testUser');
    expect(response.email).toBe('id@mail.com');
  });
  it('should return null if invalid', async () => {
    const response = await service.validateUser(
      'tedsadasd',
      'passwodsadasdrd123',
    );
    expect(response).toBeNull();
  });
  it('should login user ', async () => {
    const user = await MockUsers();
    expect(repositoryUser).toBeDefined();

    expect(service.login).toBeDefined();
    expect(await service.login(user)).toBeDefined();
    const response = await service.login(user);
    expect(response).toBeDefined();
    expect(response.access_token).toBeDefined();
  });
});
