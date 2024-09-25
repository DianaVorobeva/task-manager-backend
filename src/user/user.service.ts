import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from './users.repository';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/update-users.dto';
import * as bcrypt from 'bcrypt';
import { Role } from './user-role.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
  ) {}

  async getAllUsers(): Promise<User[]> {
    const query = this.usersRepository.createQueryBuilder('user');
    const users = query.getMany();
    return users;
  }
  async getUserById(id: string): Promise<User> {
    const found = await this.usersRepository.findOneBy({ id: id });
    if (!found) {
      throw new NotFoundException(`Task ${id} not found`);
    }
    return found;
  }
  async deleteUser(id: string): Promise<void> {
    const result = await this.usersRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Task ${id} not found`);
    }
  }

  async updateUser(id: string, updateTaskDto: UpdateUserDto): Promise<User> {
    const { firstname, lastname, password, avatar } = updateTaskDto;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await this.getUserById(id);

    user.firstname = firstname;
    user.lastname = lastname;
    user.password = hashedPassword;
    user.avatar = avatar;

    await this.usersRepository.save(user);
    return user;
  }

  async changeRole(id: string, newRole: Role): Promise<User> {
    const user = await this.getUserById(id);
    user.roles = [newRole];
    await this.usersRepository.save(user);
    return user;
  }
}
