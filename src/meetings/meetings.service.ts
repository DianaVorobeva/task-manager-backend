import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Meeting } from './meetings.entity';
import { CreateMeetingDto } from './dto/ctreate-meeting.dto';
import { User } from 'src/user/user.entity';
import { ArrayContains } from 'class-validator';
import { UpdateMeetingDto } from './dto/update-meeting.dto';

@Injectable()
export class MeetingsService {
  constructor(
    @InjectRepository(Meeting)
    private readonly meetingsRepository: Repository<Meeting>,
  ) {}

  async createMeeting(
    createMeetingDto: CreateMeetingDto,
    user: User,
  ): Promise<Meeting> {
    const { title, members, date, time } = createMeetingDto;
    const meeting = this.meetingsRepository.create({
      title,
      creatorId: user.id,
      members: members,
      date,
      time,
    });

    await this.meetingsRepository.save(meeting);
    return meeting;
  }

  async getAllMeetings(): Promise<Meeting[]> {
    const query = this.meetingsRepository.createQueryBuilder('meetings');
    const meetings = await query.getMany();
    return meetings;
  }

  async getMeetingById(id: string): Promise<Meeting> {
    const found = this.meetingsRepository.findOneBy({ id: id });
    if (!found) {
      throw new NotFoundException(`Meeting ${id} not found`);
    }
    return found;
  }

  async getMeetingByUserId(id: string): Promise<Meeting[]> {
    const meeting = await this.meetingsRepository
      .createQueryBuilder('meetings')
      .where('meetings.members @> ARRAY[:members]', {
        members: id,
      })
      .getMany();
    return meeting;
  }

  async deleteMeeting(id: string): Promise<void> {
    const result = await this.meetingsRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Meeting ${id} not found`);
    }
  }

  async updateMeeting(
    id: string,
    updateMeetingDto: UpdateMeetingDto,
    user: User,
  ): Promise<Meeting> {
    const { title, members, date, time } = updateMeetingDto;

    const meeting = await this.getMeetingById(id);

    if (user.id !== meeting.creatorId) {
      throw new ForbiddenException('Unauthorized to update this meeting');
    }

    meeting.title = title;
    meeting.members = members;
    meeting.date = date;
    meeting.time = time;

    await this.meetingsRepository.save(meeting);
    return meeting;
  }
}
