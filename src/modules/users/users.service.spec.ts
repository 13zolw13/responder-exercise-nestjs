import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

const MockUsers = [
  {
    id: faker.datatype.uuid(),
    username: faker.name.firstName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  },

  {
    id: faker.datatype.uuid(),
    username: faker.name.firstName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  },

  {
    id: faker.datatype.uuid(),
    username: faker.name.firstName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  },
];

const createMockUserDto: CreateUserDto = {
  username: MockUsers[0].username,
  email: MockUsers[0].email,
  password: MockUsers[0].password,
};

describe('UsersService', () => {
  let service: UsersService;
  let repositoryUser: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            save: jest.fn().mockResolvedValue(MockUsers[0]),
          },
        },
      ],
    }).compile();
    service = module.get<UsersService>(UsersService);
    repositoryUser = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create new user', () => {
    expect(service.create(createMockUserDto)).resolves.toEqual(MockUsers[0]);
    expect(repositoryUser.save).toHaveBeenCalledTimes(1);
    expect(repositoryUser.save).toHaveBeenCalledWith(createMockUserDto);
  });
});
