import { IoAdapter } from '@nestjs/platform-socket.io';
import { plainToInstance } from 'class-transformer';
import { User } from 'src/user/user.entity';
import { AuthenticatedSocket } from './interfaces';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as cookieParser from 'cookie-parser';
import * as cookie from 'cookie';
import { INestApplicationContext, Injectable } from '@nestjs/common';
import { Session } from './session.entity';

@Injectable()
export class WebsocketAdapter extends IoAdapter {
  @InjectRepository(Session)
  private readonly sessionRepository: Repository<Session>;
  constructor(private app: INestApplicationContext) {
    super(app);
  }
  createIOServer(port: number, options?: any) {
    const server = super.createIOServer(port, options);
    server.use(async (socket: AuthenticatedSocket, next) => {
      console.log('Inside Websocket Adapter');
      const { cookie: clientCookie } = socket.handshake.headers;
      if (!clientCookie) {
        console.log('Client has no cookies');
        return next(new Error('Not Authenticated. No cookies were sent'));
      }
      const { CHAT_APP_SESSION_ID } = cookie.parse(clientCookie);
      if (!CHAT_APP_SESSION_ID) {
        console.log('CHAT_APP_SESSION_ID DOES NOT EXIST');
        return next(new Error('Not Authenticated'));
      }
      const signedCookie = cookieParser.signedCookie(
        CHAT_APP_SESSION_ID,
        process.env.COOKIE_SECRET,
      );
      if (!signedCookie) return next(new Error('Error signing cookie'));
      const sessionDB = await this.sessionRepository.findOne(signedCookie);
      console.log(sessionDB);
      if (!sessionDB) return next(new Error('No session found'));
      const userFromJson = JSON.parse(sessionDB.json);
      if (!userFromJson.passport || !userFromJson.passport.user)
        return next(new Error('Passport or User object does not exist.'));
      const userDB = plainToInstance(
        User,
        JSON.parse(sessionDB.json).passport.user,
      );
      socket.user = userDB;
      next();
    });
    return server;
  }
}
