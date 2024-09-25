import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from './user-role.enum';
import { AuthGuard } from '@nestjs/passport';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/update-users.dto';

@UseGuards(AuthGuard(), RolesGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/all')
  getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }
  @Get('/:id')
  getUserById(@Param('id') id: string): Promise<User> {
    return this.userService.getUserById(id);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  deleteUser(@Param('id') id: string): Promise<void> {
    return this.userService.deleteUser(id);
  }

  @Patch('/:id/update')
  updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Patch('/:id/role')
  @Roles(Role.ADMIN)
  changeRole(
    @Param('id') id: string,
    @Body('newRole') newRole: Role,
  ): Promise<User> {
    return this.userService.changeRole(id, newRole);
  }
}
