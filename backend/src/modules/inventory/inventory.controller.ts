import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Query,
  Param,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { UpdateStockDto } from './dto/update-stock.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('inventory')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('update')
  @Roles(Role.ADMIN)
  updateStock(
    @CurrentUser() user: any,
    @Body() updateStockDto: UpdateStockDto,
  ) {
    return this.inventoryService.updateStock(user.userId, updateStockDto);
  }

  @Get('movements')
  @Roles(Role.ADMIN)
  getAllMovements(@Query('productId') productId?: string) {
    return this.inventoryService.getMovements(productId);
  }

  @Get('movements/:productId')
  @Roles(Role.ADMIN)
  getProductMovements(@Param('productId') productId: string) {
    return this.inventoryService.getMovements(productId);
  }
}
