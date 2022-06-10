import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
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

const updateMockUserDto: UpdateUserDto = {
  username: faker.name.firstName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  id: MockUsers[0].id,
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
            find: jest.fn().mockResolvedValue(MockUsers),
            findOneOrFail: jest.fn().mockResolvedValue(MockUsers[0]),
            update: jest.fn().mockResolvedValue(updateMockUserDto),
            delete: jest.fn().mockResolvedValue('User successfully deleted'),
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

  it('should return array of users', () => {
    expect(service.findAll()).resolves.toEqual(MockUsers);
    expect(repositoryUser.find).toHaveBeenCalledTimes(1);
    expect(repositoryUser.find).toHaveBeenCalledWith();
  });

  it('should return user by id', () => {
    expect(service.findOne(MockUsers[0].id)).resolves.toEqual(MockUsers[0]);
    expect(repositoryUser.findOneOrFail).toHaveBeenCalledTimes(1);
    expect(repositoryUser.findOneOrFail).toHaveBeenCalledWith(MockUsers[0].id);
  });
  it('should update user', async () => {
    expect(service.update(updateMockUserDto)).resolves.toEqual(
      updateMockUserDto,
    );
    expect(repositoryUser.update).toHaveBeenCalledTimes(1);
  });

  it('should delete user', async () => {
    expect(service.remove(MockUsers[0].id)).resolves.toEqual(
      'User successfully deleted',
    );
    expect(repositoryUser.delete).toHaveBeenCalledTimes(1);
    expect(repositoryUser.delete).toHaveBeenCalledWith(MockUsers[0].id);
  });
});
