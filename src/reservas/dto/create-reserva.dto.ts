import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateReservaDto {
  @ApiProperty({ example: '2026-10-10' })
  @IsDateString()
  @IsNotEmpty()
  data_inicio!: string;

  @ApiProperty({ example: '2026-10-15' })
  @IsDateString()
  @IsNotEmpty()
  data_fim!: string;

  @ApiProperty({ example: 2, minimum: 1 })
  @IsInt()
  @Min(1)
  quantidade_pessoas!: number;

  @ApiPropertyOptional({ example: 'Reserva para viagem de férias.' })
  @IsOptional()
  @IsString()
  observacoes?: string;
}
