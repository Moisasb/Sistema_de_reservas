import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import session from 'express-session';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.use(
    session({
      secret: configService.get<string>('SESSION_SECRET') || 'segredo',
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 1000 * 60 * 60 * 24 },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('API de Gerenciamento de Usuários')
    .setDescription(
      'API desenvolvida em NestJS com autenticação JWT, banco de dados MySQL, integração com serviço externo de CEP (ViaCEP) e Session.',
    )
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(configService.get<number>('PORT') ?? 3000);
}

void bootstrap();
