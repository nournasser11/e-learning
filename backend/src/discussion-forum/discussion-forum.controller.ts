import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { DiscussionForumService } from './discussion-forum.service';
import { CreateThreadDto } from './dtos/create-thread.dto';
import { UpdateThreadDto } from './dtos/update-thread.dto';
import { ReplyDto } from './dtos/reply.dto';

@Controller('discussion-forum')
export class DiscussionForumController {
    constructor(private readonly discussionForumService: DiscussionForumService) {}

    @Post('threads')
    createThread(@Body() createThreadDto: CreateThreadDto) {
        return this.discussionForumService.createThread(createThreadDto);
    }

    @Get('threads')
    getAllThreads(@Query('courseId') courseId: string) {
        return this.discussionForumService.getAllThreads(courseId);
    }

    @Get('threads/:id')
    getThread(@Param('id') id: string) {
        return this.discussionForumService.getThread(id);
    }

    @Put('threads/:id')
    updateThread(@Param('id') id: string, @Body() updateThreadDto: UpdateThreadDto) {
        return this.discussionForumService.updateThread(id, updateThreadDto);
    }

    @Delete('threads/:id')
    deleteThread(@Param('id') id: string) {
        return this.discussionForumService.deleteThread(id);
    }

    @Post('threads/:id/replies')
    addReply(@Param('id') threadId: string, @Body() replyDto: ReplyDto) {
        return this.discussionForumService.addReply(threadId, replyDto);
    }
}
