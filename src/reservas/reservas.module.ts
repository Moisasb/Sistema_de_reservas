import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { ReservasController } from './reservas.controller';
import { ReservasService } from './reservas.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ReservasController],
  providers: [ReservasService],
})
export class ReservasModule {}
