import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateUsuarioDto {
  @ApiProperty({ example: 'Fernanda Nalon' })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({ example: 'fernanda@email.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  senha: string;

  @ApiProperty({ example: '11987654321' })
  @IsString()
  @IsNotEmpty()
  telefone: string;

  @ApiProperty({ example: '01001-000' })
  @IsString()
  @Matches(/^\d{5}-?\d{3}$/, {
    message: 'CEP inválido. Formato esperado: 00000-000',
  })
  @IsNotEmpty()
  cep: string;

  @ApiPropertyOptional({ example: 'Praça da Sé' })
  @IsOptional()
  @IsString()
  rua?: string;

  @ApiPropertyOptional({ example: 'Sé' })
  @IsOptional()
  @IsString()
  bairro?: string;

  @ApiPropertyOptional({ example: 'São Paulo' })
  @IsOptional()
  @IsString()
  cidade?: string;

  @ApiPropertyOptional({ example: 'SP' })
  @IsOptional()
  @IsString()
  estado?: string;

  @ApiProperty({ example: 'Desenvolvedora' })
  @IsString()
  @IsNotEmpty()
  profissao: string;

  @ApiProperty({ example: '1998-04-29' })
  @IsDateString()
  @IsNotEmpty()
  data_nascimento: string;
}
