import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: createCategoryDto,
    });
  }

  async createDefaultCategories() {
    const defaultCategories = [
      { name: 'อาหารและเครื่องดื่ม', description: 'สินค้าประเภทอาหารและเครื่องดื่ม' },
      { name: 'ขนมและของว่าง', description: 'สินค้าประเภทขนมและของว่าง' },
      { name: 'เครื่องใช้ในบ้าน', description: 'สินค้าประเภทเครื่องใช้ในบ้าน' },
      { name: 'เครื่องเขียนและอุปกรณ์สำนักงาน', description: 'สินค้าประเภทเครื่องเขียนและอุปกรณ์สำนักงาน' },
      { name: 'เสื้อผ้าและเครื่องแต่งกาย', description: 'สินค้าประเภทเสื้อผ้าและเครื่องแต่งกาย' },
      { name: 'สุขภาพและความงาม', description: 'สินค้าประเภทสุขภาพและความงาม' },
      { name: 'ของเล่นและสื่อบันเทิง', description: 'สินค้าประเภทของเล่นและสื่อบันเทิง' },
      { name: 'อื่นๆ', description: 'สินค้าประเภทอื่นๆ' },
    ];

    for (const category of defaultCategories) {
      await this.prisma.category.upsert({
        where: { name: category.name },
        update: category,
        create: category,
      });
    }

    return this.findAll();
  }

  async findAll() {
    return this.prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { products: true },
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      return await this.prisma.category.update({
        where: { id },
        data: updateCategoryDto,
      });
    } catch (error) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.category.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
  }
}
