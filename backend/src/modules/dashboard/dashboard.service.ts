import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { startOfDay, endOfDay } from 'date-fns';

@Injectable()
export class DashboardService {
    constructor(private prisma: PrismaService) { }

    async getSummary() {
        const today = new Date();
        const start = startOfDay(today);
        const end = endOfDay(today);

        // 1. Sales today
        const salesToday = await this.prisma.sale.findMany({
            where: {
                createdAt: {
                    gte: start,
                    lte: end,
                },
            },
            include: {
                items: {
                    include: {
                        product: {
                            select: { costPrice: true },
                        },
                    },
                },
            },
        });

        const totalSalesAmount = salesToday.reduce((sum, sale) => sum + Number(sale.totalAmount), 0);

        // 2. Gross profit today
        let totalGrossProfit = 0;
        salesToday.forEach(sale => {
            sale.items.forEach(item => {
                const profitPerItem = Number(item.priceAtSale) - Number(item.product.costPrice);
                totalGrossProfit += profitPerItem * item.quantity;
            });
        });

        // 3. Low stock alert count
        const lowStockCount = await this.prisma.product.count({
            where: {
                stockQuantity: {
                    lte: this.prisma.product.fields.lowStockThreshold,
                },
            },
        });

        // 4. Total products
        const totalProducts = await this.prisma.product.count();

        return {
            salesToday: totalSalesAmount,
            grossProfitToday: totalGrossProfit,
            lowStockItems: lowStockCount,
            totalProducts: totalProducts,
            recentSalesCount: salesToday.length,
        };
    }
}
