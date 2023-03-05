import { ExchangeController } from './exchange.controller';
import { ExchangeService } from './exchange.service';
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exchange } from './entities/exchange.entity';
import { ExchangeApiService } from './exchange-api.service';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Exchange]),
  ],
  controllers: [ExchangeController],
  providers: [ExchangeService, ExchangeApiService],
})
export class ExchangeModule {}
