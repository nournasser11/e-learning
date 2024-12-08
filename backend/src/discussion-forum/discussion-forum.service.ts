import { Injectable } from '@nestjs/common';
import { CreateThreadDto } from './dtos/create-thread.dto';
import { UpdateThreadDto } from './dtos/update-thread.dto';
import { ReplyDto } from './dtos/reply.dto';

@Injectable()
export class DiscussionForumService {
    private threads = [];

    createThread(createThreadDto: CreateThreadDto) {
        const newThread = { id: Date.now().toString(), ...createThreadDto, replies: [] };
        this.threads.push(newThread);
        return newThread;
    }

    getAllThreads(courseId: string) {
        return this.threads.filter(thread => thread.courseId === courseId);
    }

    getThread(id: string) {
        return this.threads.find(thread => thread.id === id);
    }

    updateThread(id: string, updateThreadDto: UpdateThreadDto) {
        const threadIndex = this.threads.findIndex(thread => thread.id === id);
        if (threadIndex === -1) return null;
        this.threads[threadIndex] = { ...this.threads[threadIndex], ...updateThreadDto };
        return this.threads[threadIndex];
    }

    deleteThread(id: string) {
        const threadIndex = this.threads.findIndex(thread => thread.id === id);
        if (threadIndex === -1) return null;
        const [deletedThread] = this.threads.splice(threadIndex, 1);
        return deletedThread;
    }

    addReply(threadId: string, replyDto: ReplyDto) {
        const thread = this.threads.find(thread => thread.id === threadId);
        if (!thread) return null;
        const newReply = { id: Date.now().toString(), ...replyDto };
        thread.replies.push(newReply);
        return newReply;
    }
}
