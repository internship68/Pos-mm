import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreateProductDto {
    @IsOptional()
    @IsString()
    barcode?: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    costPrice: number;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    sellPrice: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    stockQuantity?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    lowStockThreshold?: number;

    @IsOptional()
    @IsString()
    imageUrl?: string;

    @IsNotEmpty()
    @IsUUID()
    categoryId: string;
}
