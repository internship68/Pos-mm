import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { SalesModule } from './modules/sales/sales.module';
import { ExpensesModule } from './modules/expenses/expenses.module';
import { ReceiptsModule } from './modules/receipts/receipts.module';
import { ReportsModule } from './modules/reports/reports.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

@Module({
  imports: [AuthModule, UsersModule, ProductsModule, CategoriesModule, InventoryModule, SalesModule, ExpensesModule, ReceiptsModule, ReportsModule, DashboardModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
