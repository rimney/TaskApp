import { Injectable, ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { tasks } from '@prisma/client';
import { Prisma } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto): Promise<tasks> {
    try {
      console.log('Creating task with data:', createTaskDto);
      return await this.prisma.tasks.create({
        data: {
          title: createTaskDto.title,
          priority: createTaskDto.priority as any, // Temporary cast; refine after schema sync
          duedate: new Date(createTaskDto.duedate),
          status: createTaskDto.status as any,
          category: createTaskDto.category as any,
          description: createTaskDto.description as any,
        },
      });
    } catch (error) {
      console.error('Create task error:', error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('A task with this ID already exists');
        }
        if (error.code === 'P2003') {
          throw new InternalServerErrorException('Invalid foreign key or constraint violation');
        }
      }
      throw new InternalServerErrorException(`Failed to create task: ${error.message}`);
    }
  }

  async findAll(): Promise<tasks[]> {
    return this.prisma.tasks.findMany();
  }

  async findOne(id: number): Promise<tasks> {
    const task = await this.prisma.tasks.findUnique({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<tasks> {
    try {
      const task = await this.prisma.tasks.findUnique({ where: { id } });
      if (!task) {
        throw new NotFoundException(`Task with ID ${id} not found`);
      }
      return await this.prisma.tasks.update({
        where: { id },
        data: {
          title: updateTaskDto.title,
          priority: updateTaskDto.priority as any,
          duedate: updateTaskDto.duedate ? new Date(updateTaskDto.duedate) : undefined,
          status: updateTaskDto.status as any,
          category: updateTaskDto.category as any,
          description: updateTaskDto.description as any,
        },
      });
    } catch (error) {
      console.error('Update task error:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to update task: ${error.message}`);
    }
  }

  async remove(id: number): Promise<void> {
    const task = await this.prisma.tasks.findUnique({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    await this.prisma.tasks.delete({ where: { id } });
  }
}