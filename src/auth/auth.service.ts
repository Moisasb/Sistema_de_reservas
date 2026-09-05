import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../database/database.service';
import { LoginDto } from './dto/login.dto';
import { Usuario } from '../usuarios/interface/usuario.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, senha } = loginDto;

    const resultado = await this.databaseService.query(
      `SELECT id, nome, email, senha FROM usuarios WHERE email = ?`,
      [email],
    );

    const usuarios = resultado as Usuario[];
    const usuario = usuarios[0];

    if (!usuario) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    const senhaValida = await compare(senha, usuario.senha);

    if (!senhaValida) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    const payload = {
      sub: usuario.id,
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
    };

    const token = this.jwtService.sign(payload);

    return {
      mensagem: 'Login realizado com sucesso',
      access_token: token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
      },
    };
  }
}
