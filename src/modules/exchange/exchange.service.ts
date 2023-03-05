import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { ConvertApiPayload } from './dto/convert-api-payload.dto';
import { GetAllTransactionsPayload } from './dto/get-all-transactions-payload';
import { TransactionResponse } from './dto/transaction-response';
import { Exchange } from './entities/exchange.entity';
import { ExchangeApiService } from './exchange-api.service';

@Injectable()
export class ExchangeService {
  constructor(
    @InjectRepository(Exchange)
    private exchangeRepository: Repository<Exchange>,
    private exchangeApiService: ExchangeApiService,
  ) {}

  public async transaction(payload: ConvertApiPayload, user: User): Promise<TransactionResponse> {
    const apiResponse = await this.exchangeApiService.convert(payload);
    const { from, to, value } = payload;
    if (apiResponse) {
      const transaction = await this.exchangeRepository.save({
        from,
        to,
        resultValue: apiResponse.result,
        rate: apiResponse.rate,
        originValue: value,
        transactionDate: new Date(),
        user,
      })

      return {
        from: transaction.from, 
        to: transaction.to, 
        originValue: transaction.originValue,
        resultValue: transaction.resultValue,
        rate: transaction.rate, 
        transactionDate: transaction.transactionDate,
        userId: transaction.user.id,
        transactionId: transaction.id
      }
    }

    throw new InternalServerErrorException('error on conversion');
  }

  public async getAllTransactions(user: User): Promise<Exchange[]> {
    return await this.exchangeRepository.find({
      where: {
        user,
      },
      select: {
        from: true,
        id: true,
        originValue: true,
        rate: true, 
        resultValue: true, 
        to: true, 
        transactionDate: true, 
        user: {
            id: true,
        }
      }
    })
  }
  
}
