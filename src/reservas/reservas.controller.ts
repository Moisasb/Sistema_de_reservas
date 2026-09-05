import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { ReservasService } from './reservas.service';

@ApiTags('Reservas')
@ApiBearerAuth('access-token')
@Controller('reservas')
export class ReservasController {
  constructor(private readonly reservasService: ReservasService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma reserva para o usuário autenticado' })
  @ApiResponse({ status: 201, description: 'Reserva criada com sucesso.' })
  async criar(@Req() req: Request, @Body() dto: CreateReservaDto) {
    return this.reservasService.criar(this.usuarioId(req), dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar as reservas do usuário autenticado' })
  async listar(@Req() req: Request) {
    return this.reservasService.listarDoUsuario(this.usuarioId(req));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma reserva do usuário autenticado' })
  @ApiParam({ name: 'id', example: 1 })
  async buscar(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    return this.reservasService.buscarPorIdDoUsuario(this.usuarioId(req), id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar uma reserva do usuário autenticado' })
  async atualizar(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateReservaDto,
  ) {
    return this.reservasService.atualizar(this.usuarioId(req), id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancelar uma reserva do usuário autenticado' })
  async cancelar(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    return this.reservasService.cancelar(this.usuarioId(req), id);
  }

  private usuarioId(req: Request): number {
    const usuario = req['user'] as { sub?: number } | undefined;
    if (!usuario?.sub) {
      throw new UnauthorizedException('Usuário autenticado não identificado.');
    }
    return Number(usuario.sub);
  }
}
