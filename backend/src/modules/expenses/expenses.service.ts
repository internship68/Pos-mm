import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';

@Injectable()
export class ExpensesService {
  constructor(private prisma: PrismaService) {}

  async create(createExpenseDto: CreateExpenseDto) {
    return this.prisma.expense.create({
      data: {
        ...createExpenseDto,
        date: createExpenseDto.date
          ? new Date(createExpenseDto.date)
          : new Date(),
      },
    });
  }

  async findAll() {
    return this.prisma.expense.findMany({
      orderBy: { date: 'desc' },
    });
  }

  async findOne(id: string) {
    const expense = await this.prisma.expense.findUnique({
      where: { id },
    });
    if (!expense) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }
    return expense;
  }

  async remove(id: string) {
    try {
      return await this.prisma.expense.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }
  }
}
