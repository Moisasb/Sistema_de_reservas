import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { EnderecoModule } from '../endereco/endereco.module';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';

@Module({
  imports: [DatabaseModule, EnderecoModule],
  controllers: [UsuariosController],
  providers: [UsuariosService],
})
export class UsuariosModule {}
