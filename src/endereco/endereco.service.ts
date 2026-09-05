import {
  BadRequestException,
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

interface GeoResponse {
  results?: Array<{
    name: string;
    admin1?: string;
    country?: string;
    latitude: number;
    longitude: number;
  }>;
}

@Injectable()
export class EnderecoService {
  constructor(private readonly httpService: HttpService) {}

  private normalizarCep(cep: string): string {
    const cepLimpo = cep.replace(/\D/g, '');

    if (cepLimpo.length !== 8) {
      throw new BadRequestException('O CEP deve conter exatamente 8 números.');
    }

    return cepLimpo;
  }

  async buscarEnderecoPorCep(cep: string) {
    const cepLimpo = this.normalizarCep(cep);

    try {
      const resposta = await lastValueFrom(
        this.httpService.get<ViaCepResponse>(
          `https://viacep.com.br/ws/${cepLimpo}/json/`,
        ),
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

  async buscarCidade(cidade: string) {
    if (!cidade || cidade.trim().length < 2) {
      throw new BadRequestException('Informe uma cidade válida.');
    }

    try {
      const resposta = await lastValueFrom(
        this.httpService.get<GeoResponse>(
          'https://geocoding-api.open-meteo.com/v1/search',
          {
            params: {
              name: cidade.trim(),
              count: 1,
              language: 'pt',
              countryCode: 'BR',
              format: 'json',
            },
          },
        ),
      );

      if (!resposta.data.results?.length) {
        throw new NotFoundException('Localidade não encontrada.');
      }

      const localizacao = resposta.data.results[0];

      return {
        cidade: localizacao.name,
        estado: localizacao.admin1,
        pais: localizacao.country,
        latitude: localizacao.latitude,
        longitude: localizacao.longitude,
      };
    } catch (erro) {
      if (
        erro instanceof BadRequestException ||
        erro instanceof NotFoundException
      ) {
        throw erro;
      }

      throw new ServiceUnavailableException(
        'Não foi possível consultar o serviço de localização no momento.',
      );
    }
  }

  async buscarCepComCoordenadas(cep: string) {
    const endereco = await this.buscarEnderecoPorCep(cep);
    const localizacao = await this.buscarCidade(endereco.cidade);

    return {
      ...endereco,
      latitude: localizacao.latitude,
      longitude: localizacao.longitude,
    };
  }
}
