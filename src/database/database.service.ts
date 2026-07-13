import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createPool, Pool } from 'mysql2/promise';

@Injectable()
export class DatabaseService {
  private pool: Pool;

  constructor(private readonly configService: ConfigService) {
    this.pool = createPool({
      host: this.configService.get<string>('DB_HOST'),
      port: Number(this.configService.get<string>('DB_PORT')),
      user: this.configService.get<string>('DB_USER'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: this.configService.get<string>('DB_NAME'),
    });
  }

  async query(sql: string, params?: any[]) {
    const [resultado] = await this.pool.execute(sql, params);
    return resultado;
  }
}
