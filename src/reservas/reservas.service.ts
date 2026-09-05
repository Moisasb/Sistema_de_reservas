import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { Reserva } from './interface/reserva.interface';

@Injectable()
export class ReservasService {
  constructor(private readonly databaseService: DatabaseService) {}

  async criar(usuarioId: number, dto: CreateReservaDto) {
    this.validarPeriodo(dto.data_inicio, dto.data_fim);

    const sql = `
      INSERT INTO reservas
        (usuario_id, data_inicio, data_fim, quantidade_pessoas, status, observacoes)
      VALUES (?, ?, ?, ?, 'PENDENTE', ?)
    `;

    const resultado: any = await this.databaseService.query(sql, [
      usuarioId,
      dto.data_inicio,
      dto.data_fim,
      dto.quantidade_pessoas,
      dto.observacoes ?? null,
    ]);

    return this.buscarPorIdDoUsuario(usuarioId, resultado.insertId);
  }

  async listarDoUsuario(usuarioId: number) {
    const sql = `
      SELECT id, usuario_id, data_inicio, data_fim, quantidade_pessoas,
             status, observacoes, criado_em, atualizado_em
      FROM reservas
      WHERE usuario_id = ?
      ORDER BY data_inicio DESC, id DESC
    `;

    const resultado = await this.databaseService.query(sql, [usuarioId]);
    return resultado as Reserva[];
  }

  async buscarPorIdDoUsuario(usuarioId: number, id: number) {
    const sql = `
      SELECT id, usuario_id, data_inicio, data_fim, quantidade_pessoas,
             status, observacoes, criado_em, atualizado_em
      FROM reservas
      WHERE id = ? AND usuario_id = ?
    `;

    const resultado = await this.databaseService.query(sql, [id, usuarioId]);
    const reservas = resultado as Reserva[];

    if (!reservas[0]) {
      throw new NotFoundException(`Reserva com id "${id}" não encontrada.`);
    }

    return reservas[0];
  }

  async atualizar(usuarioId: number, id: number, dto: UpdateReservaDto) {
    const reserva = await this.buscarPorIdDoUsuario(usuarioId, id);

    if (reserva.status === 'CANCELADA' || reserva.status === 'CONCLUIDA') {
      throw new BadRequestException('Esta reserva não pode mais ser alterada.');
    }

    const dataInicio = dto.data_inicio ?? reserva.data_inicio;
    const dataFim = dto.data_fim ?? reserva.data_fim;
    this.validarPeriodo(dataInicio, dataFim);

    const sql = `
      UPDATE reservas SET
        data_inicio = ?,
        data_fim = ?,
        quantidade_pessoas = ?,
        observacoes = ?
      WHERE id = ? AND usuario_id = ?
    `;

    await this.databaseService.query(sql, [
      dataInicio,
      dataFim,
      dto.quantidade_pessoas ?? reserva.quantidade_pessoas,
      dto.observacoes ?? reserva.observacoes,
      id,
      usuarioId,
    ]);

    return this.buscarPorIdDoUsuario(usuarioId, id);
  }

  async cancelar(usuarioId: number, id: number) {
    const reserva = await this.buscarPorIdDoUsuario(usuarioId, id);

    if (reserva.status === 'CANCELADA') {
      throw new BadRequestException('A reserva já está cancelada.');
    }

    if (reserva.status === 'CONCLUIDA') {
      throw new BadRequestException('Uma reserva concluída não pode ser cancelada.');
    }

    await this.databaseService.query(
      `UPDATE reservas SET status = 'CANCELADA' WHERE id = ? AND usuario_id = ?`,
      [id, usuarioId],
    );

    return { mensagem: 'Reserva cancelada com sucesso.' };
  }

  private validarPeriodo(dataInicio: string, dataFim: string) {
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);

    if (Number.isNaN(inicio.getTime()) || Number.isNaN(fim.getTime())) {
      throw new BadRequestException('As datas informadas são inválidas.');
    }

    if (inicio >= fim) {
      throw new BadRequestException(
        'A data de início deve ser anterior à data de fim.',
      );
    }
  }
}
