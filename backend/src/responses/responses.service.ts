import { Injectable } from '@nestjs/common';
import { CreateResponseDto } from '../dto/create-response.dto';
import { UpdateResponseDto } from '../dto/update-response.dto';


@Injectable()
export class ResponsesService {
    private responses = [];

    create(createResponseDto: CreateResponseDto) {
        const newResponse = { id: Date.now(), ...createResponseDto };
        this.responses.push(newResponse);
        return newResponse;
    }

    findAll() {
        return this.responses;
    }

    findOne(id: number) {
        return this.responses.find(response => response.id === id);
    }

    update(id: number, updateResponseDto: UpdateResponseDto) {
        const responseIndex = this.responses.findIndex(response => response.id === id);
        if (responseIndex === -1) {
            return null;
        }
        this.responses[responseIndex] = { ...this.responses[responseIndex], ...updateResponseDto };
        return this.responses[responseIndex];
    }

    remove(id: number) {
        const responseIndex = this.responses.findIndex(response => response.id === id);
        if (responseIndex === -1) {
            return null;
        }
        const removedResponse = this.responses.splice(responseIndex, 1);
        return removedResponse[0];
    }
}