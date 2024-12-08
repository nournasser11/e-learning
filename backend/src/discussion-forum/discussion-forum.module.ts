import { Module } from '@nestjs/common';
import { DiscussionForumController } from './discussion-forum.controller';
import { DiscussionForumService } from './discussion-forum.service';

@Module({
    controllers: [DiscussionForumController],
    providers: [DiscussionForumService],
})
export class DiscussionForumModule {}
