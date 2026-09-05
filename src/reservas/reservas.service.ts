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
    this.validarDataInicio(dto.data_inicio);
    await this.validarConflito(usuarioId, dto.data_inicio, dto.data_fim);

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
    this.validarDataInicio(dataInicio);
    await this.validarConflito(usuarioId, dataInicio, dataFim, id);

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
    const inicio = this.criarData(dataInicio);
    const fim = this.criarData(dataFim);

    if (!inicio || !fim) {
      throw new BadRequestException('As datas informadas são inválidas.');
    }

    if (inicio >= fim) {
      throw new BadRequestException(
        'A data de início deve ser anterior à data de fim.',
      );
    }
  }

  private validarDataInicio(dataInicio: string) {
    const inicio = this.criarData(dataInicio);
    const hoje = this.criarData(this.dataAtual());

    if (!inicio || !hoje) {
      throw new BadRequestException('A data de início informada é inválida.');
    }

    if (inicio < hoje) {
      throw new BadRequestException(
        'A data de início não pode ser anterior à data atual.',
      );
    }
  }

  private async validarConflito(
    usuarioId: number,
    dataInicio: string,
    dataFim: string,
    reservaId?: number,
  ) {
    const parametros: Array<string | number> = [
      usuarioId,
      dataFim,
      dataInicio,
    ];

    let sql = `
      SELECT id
      FROM reservas
      WHERE usuario_id = ?
        AND status NOT IN ('CANCELADA', 'CONCLUIDA')
        AND data_inicio < ?
        AND data_fim > ?
    `;

    if (reservaId !== undefined) {
      sql += ' AND id <> ?';
      parametros.push(reservaId);
    }

    sql += ' LIMIT 1';

    const resultado = await this.databaseService.query(sql, parametros);
    if ((resultado as Array<{ id: number }>)[0]) {
      throw new BadRequestException(
        'Já existe uma reserva ativa para este usuário no período informado.',
      );
    }
  }

  private criarData(valor: string): Date | null {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
      return null;
    }

    const [ano, mes, dia] = valor.split('-').map(Number);
    const data = new Date(Date.UTC(ano, mes - 1, dia));

    if (
      data.getUTCFullYear() !== ano ||
      data.getUTCMonth() !== mes - 1 ||
      data.getUTCDate() !== dia
    ) {
      return null;
    }

    return data;
  }

  private dataAtual() {
    return new Date().toISOString().slice(0, 10);
  }
}
