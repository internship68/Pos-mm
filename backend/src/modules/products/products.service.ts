import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
    constructor(private prisma: PrismaService) { }

    async create(createProductDto: CreateProductDto) {
        return this.prisma.product.create({
            data: createProductDto,
            include: { category: true },
        });
    }

    async findAll() {
        return this.prisma.product.findMany({
            include: { category: true },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: { category: true, movements: { take: 10, orderBy: { createdAt: 'desc' } } },
        });
        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
        return product;
    }

    async findByBarcode(barcode: string) {
        const product = await this.prisma.product.findUnique({
            where: { barcode },
            include: { category: true },
        });
        if (!product) {
            throw new NotFoundException(`Product with barcode ${barcode} not found`);
        }
        return product;
    }

    async findLowStock() {
        // Note: Prisma 7 might have issues with field-to-field comparison in some cases, 
        // but this is the standard way.
        return this.prisma.product.findMany({
            where: {
                stockQuantity: {
                    lte: this.prisma.product.fields.lowStockThreshold,
                },
            },
            include: { category: true },
        });
    }

    async update(id: string, updateProductDto: UpdateProductDto) {
        try {
            return await this.prisma.product.update({
                where: { id },
                data: updateProductDto,
                include: { category: true },
            });
        } catch (error) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
    }

    async remove(id: string) {
        try {
            return await this.prisma.product.delete({
                where: { id },
            });
        } catch (error) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
    }
}
