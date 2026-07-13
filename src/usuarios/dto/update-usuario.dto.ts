import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class UpdateUsuarioDto {
  @ApiPropertyOptional({ example: 'Fernanda Nalon' })
  @IsOptional()
  @IsString()
  nome?: string;

  @ApiPropertyOptional({ example: 'fernanda@email.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'novaSenha123' })
  @IsOptional()
  @IsString()
  @MinLength(6)
  senha?: string;

  @ApiPropertyOptional({ example: '11987654321' })
  @IsOptional()
  @IsString()
  telefone?: string;

  @ApiPropertyOptional({ example: '01001-000' })
  @IsOptional()
  @IsString()
  @Matches(/^\d{5}-?\d{3}$/, {
    message: 'CEP inválido. Formato esperado: 00000-000',
  })
  cep?: string;

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

  @ApiPropertyOptional({ example: 'Desenvolvedora' })
  @IsOptional()
  @IsString()
  profissao?: string;

  @ApiPropertyOptional({ example: '1998-04-29' })
  @IsOptional()
  @IsDateString()
  data_nascimento?: string;
}
