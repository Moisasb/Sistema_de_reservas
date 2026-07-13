import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { EnderecoController } from './endereco.controller';
import { EnderecoService } from './endereco.service';

@Module({
  imports: [HttpModule],
  controllers: [EnderecoController],
  providers: [EnderecoService],
  exports: [EnderecoService],
})
export class EnderecoModule {}
