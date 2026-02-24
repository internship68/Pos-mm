import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { MovementType } from '../../common/enums/movement-type.enum';

@Injectable()
export class SalesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createSaleDto: CreateSaleDto) {
    const { items, paymentMethod, slipUrl } = createSaleDto;

    if (items.length === 0) {
      throw new BadRequestException('Sale must have at least one item');
    }

    // 1. Fetch products and validate stock/existence
    const productIds = items.map((item) => item.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== items.length) {
      throw new NotFoundException('One or more products not found');
    }

    // Map items to include price and validate stock
    let totalAmount = 0;
    const saleItemsWithPrices = items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product)
        throw new NotFoundException(`Product ${item.productId} not found`);

      if (product.stockQuantity < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for product: ${product.name}`,
        );
      }

      const itemTotal = Number(product.sellPrice) * item.quantity;
      totalAmount += itemTotal;

      return {
        productId: item.productId,
        quantity: item.quantity,
        priceAtSale: product.sellPrice,
      };
    });

    // 2. Perform Transaction
    return this.prisma.$transaction(async (tx) => {
      // a. Create Sale
      const sale = await tx.sale.create({
        data: {
          totalAmount,
          paymentMethod,
          slipUrl,
          cashierId: userId,
          items: {
            create: saleItemsWithPrices,
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          cashier: {
            select: { name: true },
          },
        },
      });

      // b. Update Stock and Create Stock Movement for each item
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stockQuantity: {
              decrement: item.quantity,
            },
          },
        });

        await tx.stockMovement.create({
          data: {
            productId: item.productId,
            type: MovementType.OUT,
            quantity: item.quantity,
            reason: `Sale ID: ${sale.id}`,
            userId: userId,
          },
        });
      }

      return sale;
    });
  }

  async findAll() {
    return this.prisma.sale.findMany({
      include: {
        items: { include: { product: true } },
        cashier: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const sale = await this.prisma.sale.findUnique({
      where: { id },
      include: {
        items: { include: { product: true } },
        cashier: { select: { name: true } },
      },
    });
    if (!sale) {
      throw new NotFoundException(`Sale with ID ${id} not found`);
    }
    return sale;
  }
}
