import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'fernanda@email.com',
    description: 'E-mail do usuário cadastrado',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    example: '123456',
    description: 'Senha do usuário cadastrado',
  })
  @IsString()
  @IsNotEmpty()
  senha!: string;
}
