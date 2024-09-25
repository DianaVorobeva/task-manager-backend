import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateMeetingDto } from './dto/ctreate-meeting.dto';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/user/user.entity';
import { Meeting } from './meetings.entity';
import { MeetingsService } from './meetings.service';
import { UpdateMeetingDto } from './dto/update-meeting.dto';

@Controller('meetings')
@UseGuards(AuthGuard())
export class MeetingsController {
  constructor(private meetingsService: MeetingsService) {}
  @Post()
  createMeeting(
    @Body() createMeetingDto: CreateMeetingDto,
    @GetUser() user: User,
  ): Promise<Meeting> {
    return this.meetingsService.createMeeting(createMeetingDto, user);
  }

  @Get()
  getMeetings(): Promise<Meeting[]> {
    return this.meetingsService.getAllMeetings();
  }

  @Get('/:id')
  getMeetingById(@Param('id') id: string): Promise<Meeting> {
    return this.meetingsService.getMeetingById(id);
  }

  @Get('/:id/user')
  getMeetingByUserId(@Param('id') id: string): Promise<Meeting[]> {
    return this.meetingsService.getMeetingByUserId(id);
  }

  @Delete('/:id')
  deleteMeeting(@Param('id') id: string): Promise<void> {
    return this.meetingsService.deleteMeeting(id);
  }

  @Patch('/:id')
  updateTaskByUser(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body() updateMeetingDto: UpdateMeetingDto,
  ): Promise<Meeting> {
    return this.meetingsService.updateMeeting(id, updateMeetingDto, user);
  }
}
