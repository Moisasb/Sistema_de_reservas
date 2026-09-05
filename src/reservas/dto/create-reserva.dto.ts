import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateReservaDto {
  @ApiProperty({ example: '2026-10-10' })
  @IsDateString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'data_inicio deve estar no formato YYYY-MM-DD.',
  })
  @IsNotEmpty()
  data_inicio!: string;

  @ApiProperty({ example: '2026-10-15' })
  @IsDateString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'data_fim deve estar no formato YYYY-MM-DD.',
  })
  @IsNotEmpty()
  data_fim!: string;

  @ApiProperty({ example: 2, minimum: 1 })
  @IsInt()
  @Min(1)
  quantidade_pessoas!: number;

  @ApiPropertyOptional({ example: 'Reserva para viagem de férias.' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  observacoes?: string;
}
