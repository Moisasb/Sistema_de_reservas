import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { UsuariosService } from './usuarios.service';

@ApiTags('Usuários')
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Cadastrar novo usuário' })
  @ApiResponse({ status: 201, description: 'Usuário cadastrado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou CEP inválido.' })
  @ApiResponse({ status: 404, description: 'CEP não encontrado.' })
  @ApiResponse({ status: 409, description: 'E-mail já cadastrado.' })
  @ApiResponse({
    status: 503,
    description: 'Falha na comunicação com o serviço de CEP.',
  })
  cadastrar(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.cadastrar(createUsuarioDto);
  }

  @Get()
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Listar todos os usuários' })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuários retornada com sucesso.',
  })
  @ApiResponse({ status: 401, description: 'Não autenticado.' })
  listarTodos() {
    return this.usuariosService.listarTodos();
  }

  @Get(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Buscar usuário por ID' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Usuário encontrado.' })
  @ApiResponse({ status: 401, description: 'Não autenticado.' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  buscarPorId(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.buscarPorId(id);
  }

  @Patch(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Atualizar usuário' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autenticado.' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  @ApiResponse({
    status: 409,
    description: 'E-mail já cadastrado para outro usuário.',
  })
  atualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ) {
    return this.usuariosService.atualizar(id, updateUsuarioDto);
  }

  @Delete(':id')
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Excluir usuário' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Usuário removido com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autenticado.' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  remover(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.remover(id);
  }
}
