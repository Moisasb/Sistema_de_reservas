import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { EnderecoService } from './endereco.service';

@ApiTags('Endereço')
@Controller('endereco')
export class EnderecoController {
  constructor(private readonly enderecoService: EnderecoService) {}

  @Get(':cep')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Consultar endereço a partir de um CEP' })
  @ApiParam({ name: 'cep', example: '01001000' })
  @ApiResponse({ status: 200, description: 'Endereço encontrado.' })
  @ApiResponse({ status: 400, description: 'CEP inválido.' })
  @ApiResponse({ status: 404, description: 'CEP não encontrado.' })
  @ApiResponse({
    status: 503,
    description: 'Falha na comunicação com o serviço de CEP.',
  })
  buscarEndereco(@Param('cep') cep: string) {
    return this.enderecoService.buscarEnderecoPorCep(cep);
  }
}
