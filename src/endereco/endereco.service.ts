import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

interface ViaCepResponse {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

@Injectable()
export class EnderecoService {
  constructor(private readonly httpService: HttpService) {}

  async buscarEnderecoPorCep(cep: string) {
    const cepLimpo = cep.replace(/\D/g, '');

    if (cepLimpo.length !== 8) {
      throw new BadRequestException('O CEP deve conter exatamente 8 números.');
    }

    try {
      const url = `https://viacep.com.br/ws/${cepLimpo}/json/`;
      const resposta = await lastValueFrom(
        this.httpService.get<ViaCepResponse>(url),
      );

      if (resposta.data.erro) {
        throw new NotFoundException('CEP não encontrado.');
      }

      return {
        cep: resposta.data.cep,
        rua: resposta.data.logradouro,
        bairro: resposta.data.bairro,
        cidade: resposta.data.localidade,
        estado: resposta.data.uf,
      };
    } catch (erro) {
      if (
        erro instanceof BadRequestException ||
        erro instanceof NotFoundException
      ) {
        throw erro;
      }

      throw new ServiceUnavailableException(
        'Não foi possível consultar o serviço de CEP no momento.',
      );
    }
  }
}
