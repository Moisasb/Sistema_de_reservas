import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { hash } from 'bcrypt';
import { RowDataPacket } from 'mysql2';
import { DatabaseService } from '../database/database.service';
import { EnderecoService } from '../endereco/endereco.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './interface/usuario.interface';

const SALT_ROUNDS = 10;

@Injectable()
export class UsuariosService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly enderecoService: EnderecoService,
  ) {}

  async cadastrar(createUsuarioDto: CreateUsuarioDto) {
    const emailExistente = await this.buscarPorEmail(createUsuarioDto.email);

    if (emailExistente) {
      throw new ConflictException(
        'Já existe um usuário cadastrado com este e-mail.',
      );
    }

    const endereco = await this.enderecoService.buscarEnderecoPorCep(
      createUsuarioDto.cep,
    );

    const senhaHash = await hash(createUsuarioDto.senha, SALT_ROUNDS);

    const sql = `
      INSERT INTO usuarios
        (nome, email, senha, telefone, cep, rua, bairro, cidade, estado, profissao, data_nascimento)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await this.databaseService.query(sql, [
      createUsuarioDto.nome,
      createUsuarioDto.email,
      senhaHash,
      createUsuarioDto.telefone,
      endereco.cep,
      createUsuarioDto.rua ?? endereco.rua,
      createUsuarioDto.bairro ?? endereco.bairro,
      createUsuarioDto.cidade ?? endereco.cidade,
      createUsuarioDto.estado ?? endereco.estado,
      createUsuarioDto.profissao,
      createUsuarioDto.data_nascimento,
    ]);

    return { mensagem: 'Usuário cadastrado com sucesso' };
  }

  async listarTodos() {
    const sql = `
      SELECT id, nome, email, telefone, cep, rua, bairro, cidade, estado,
             profissao, data_nascimento, criado_em, atualizado_em
      FROM usuarios
      ORDER BY id DESC
    `;
    const resultado = await this.databaseService.query(sql);
    return resultado as Usuario[];
  }

  async buscarPorId(id: number) {
    const sql = `
      SELECT id, nome, email, telefone, cep, rua, bairro, cidade, estado,
             profissao, data_nascimento, criado_em, atualizado_em
      FROM usuarios
      WHERE id = ?
    `;
    const resultado = await this.databaseService.query(sql, [id]);
    const usuarios = resultado as Usuario[];
    const usuario = usuarios[0];

    if (!usuario) {
      throw new NotFoundException(`Usuário com id "${id}" não encontrado.`);
    }

    return usuario;
  }

  async buscarPorEmail(email: string) {
    const sql = 'SELECT id FROM usuarios WHERE email = ?';
    const resultado = await this.databaseService.query(sql, [email]);
    return (resultado as RowDataPacket[])[0];
  }

  async atualizar(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    const usuarioAtual = await this.buscarPorId(id);

    if (
      updateUsuarioDto.email &&
      updateUsuarioDto.email !== usuarioAtual.email
    ) {
      const emailExistente = await this.buscarPorEmail(updateUsuarioDto.email);
      if (emailExistente) {
        throw new ConflictException(
          'Já existe um usuário cadastrado com este e-mail.',
        );
      }
    }

    let rua = updateUsuarioDto.rua ?? usuarioAtual.rua;
    let bairro = updateUsuarioDto.bairro ?? usuarioAtual.bairro;
    let cidade = updateUsuarioDto.cidade ?? usuarioAtual.cidade;
    let estado = updateUsuarioDto.estado ?? usuarioAtual.estado;
    let cep = usuarioAtual.cep;

    if (updateUsuarioDto.cep && updateUsuarioDto.cep !== usuarioAtual.cep) {
      const endereco = await this.enderecoService.buscarEnderecoPorCep(
        updateUsuarioDto.cep,
      );
      cep = endereco.cep;
      rua = updateUsuarioDto.rua ?? endereco.rua;
      bairro = updateUsuarioDto.bairro ?? endereco.bairro;
      cidade = updateUsuarioDto.cidade ?? endereco.cidade;
      estado = updateUsuarioDto.estado ?? endereco.estado;
    }

    const senha = updateUsuarioDto.senha
      ? await hash(updateUsuarioDto.senha, SALT_ROUNDS)
      : null;

    const sql = `
      UPDATE usuarios SET
        nome = ?,
        email = ?,
        senha = COALESCE(?, senha),
        telefone = ?,
        cep = ?,
        rua = ?,
        bairro = ?,
        cidade = ?,
        estado = ?,
        profissao = ?,
        data_nascimento = ?
      WHERE id = ?
    `;

    await this.databaseService.query(sql, [
      updateUsuarioDto.nome ?? usuarioAtual.nome,
      updateUsuarioDto.email ?? usuarioAtual.email,
      senha,
      updateUsuarioDto.telefone ?? usuarioAtual.telefone,
      cep,
      rua,
      bairro,
      cidade,
      estado,
      updateUsuarioDto.profissao ?? usuarioAtual.profissao,
      updateUsuarioDto.data_nascimento ?? usuarioAtual.data_nascimento,
      id,
    ]);

    return { mensagem: 'Usuário atualizado com sucesso' };
  }

  async remover(id: number) {
    await this.buscarPorId(id);
    await this.databaseService.query('DELETE FROM usuarios WHERE id = ?', [id]);
    return { mensagem: 'Usuário removido com sucesso' };
  }
}
