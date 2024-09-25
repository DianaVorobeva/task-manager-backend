import { Socket } from 'socket.io';
import { User } from 'src/user/user.entity';

export interface AuthenticatedSocket extends Socket {
  user?: User;
}
