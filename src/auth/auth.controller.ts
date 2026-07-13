import {
  Controller,
  Body,
  Post,
  Get,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from './decorators/public.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Request } from 'express';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Realizar login do usuário' })
  @ApiResponse({ status: 200, description: 'Login realizado com sucesso.' })
  @ApiResponse({ status: 401, description: 'E-mail ou senha inválidos.' })
  async login(@Body() loginDto: LoginDto, @Req() req: Request) {
    const resultado = await this.authService.login(loginDto);

    req.session.usuario = {
      nome: resultado.usuario.nome,
      email: resultado.usuario.email,
      loginEm: new Date().toISOString(),
    };

    return resultado;
  }

  @Get('session')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Consultar dados da sessão atual' })
  @ApiResponse({ status: 200, description: 'Dados de sessão encontrados.' })
  @ApiResponse({ status: 401, description: 'Não autenticado.' })
  getSession(@Req() req: Request) {
    return (
      req.session.usuario ?? {
        mensagem: 'Nenhuma sessão ativa encontrada. Realize login novamente.',
      }
    );
  }
}
