import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('sales')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SalesController {
    constructor(private readonly salesService: SalesService) { }

    @Post()
    @Roles(Role.ADMIN, Role.CASHIER)
    create(@CurrentUser() user: any, @Body() createSaleDto: CreateSaleDto) {
        return this.salesService.create(user.userId, createSaleDto);
    }

    @Get()
    @Roles(Role.ADMIN, Role.CASHIER)
    findAll() {
        return this.salesService.findAll();
    }

    @Get(':id')
    @Roles(Role.ADMIN, Role.CASHIER)
    findOne(@Param('id') id: string) {
        return this.salesService.findOne(id);
    }
}
