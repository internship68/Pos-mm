import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { UpdateStockDto } from './dto/update-stock.dto';
import { MovementType } from '../../common/enums/movement-type.enum';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  async updateStock(userId: string, updateStockDto: UpdateStockDto) {
    const { productId, type, quantity, reason } = updateStockDto;

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    let newQuantity = product.stockQuantity;
    if (type === MovementType.IN) {
      newQuantity += quantity;
    } else if (type === MovementType.OUT || type === MovementType.ADJUST) {
      if (type === MovementType.OUT && product.stockQuantity < quantity) {
        throw new BadRequestException('Insufficient stock');
      }
      newQuantity -= quantity;
    }

    return this.prisma.$transaction(async (tx) => {
      const updatedProduct = await (tx as any).product.update({
        where: { id: productId },
        data: { stockQuantity: newQuantity },
      });

      const movement = await (tx as any).stockMovement.create({
        data: {
          productId,
          type,
          quantity,
          reason,
          userId,
        },
      });

      return { product: updatedProduct, movement };
    });
  }

  async getMovements(productId?: string) {
    return this.prisma.stockMovement.findMany({
      where: productId ? { productId } : {},
      include: {
        product: {
          select: { name: true, barcode: true },
        },
        user: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
