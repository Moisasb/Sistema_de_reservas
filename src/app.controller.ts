import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello() {
    return {
      name: 'Sistema de Reservas',
      status: 'online',
      message: 'API pronta para uso.',
    };
  }
}
