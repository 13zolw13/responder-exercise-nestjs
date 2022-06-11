import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async findOneByUsername(username: string) {
    return await this.userRepository.findOne({ username: username });
  }

  async create(createUserDto: CreateUserDto) {
    return await this.userRepository.save(createUserDto);
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: string) {
    return await this.userRepository.findOneOrFail(id);
  }

  async update(updateUserDto: UpdateUserDto) {
    return await this.userRepository.update(updateUserDto.id, updateUserDto);
  }

  async remove(id: string) {
    await this.userRepository.delete(id);
    return 'User successfully deleted';
  }
}
