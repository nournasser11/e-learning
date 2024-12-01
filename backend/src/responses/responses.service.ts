import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Response } from '../models/responses.schema';
import { CreateResponseDto } from '../dto/create-response.dto';

@Injectable()
export class ResponsesService {
  constructor(
    @InjectModel(Response.name) private responseModel: Model<Response>,
  ) {}

  async create(createResponseDto: CreateResponseDto): Promise<Response> {
    const response = new this.responseModel(createResponseDto);
    return response.save();
  }

  async findAll(): Promise<Response[]> {
    return this.responseModel.find().exec();
  }

  async findByQuestionId(questionId: string): Promise<Response[]> {
    return this.responseModel.find({ questionId }).exec();
  }

  async findOne(id: string): Promise<Response | null> {
    return this.responseModel.findById(id).exec();
  }

  async update(id: string, updateResponseDto: Partial<Response>): Promise<Response | null> {
    return this.responseModel.findByIdAndUpdate(id, updateResponseDto, { new: true }).exec();
  }

  async remove(id: string): Promise<void> {
    await this.responseModel.findByIdAndDelete(id).exec();
  }
}
