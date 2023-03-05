import { InternalServerErrorException } from "@nestjs/common"
import { Exchange, ValidCurrency } from "../entities/exchange.entity"
import { ExchangeService } from "../exchange.service"

const exchangeRepository: any = jest.fn()
const exchangeApiService: any = jest.fn()

const user: any = {
  email: 'test@test.com',
  id: "test",
  name: "test",
  password: "test"
}

describe('ExchangeService', () => { 
  describe('transaction', () => {
    it('should not create becausa api failed', async () => {
        const sevice = new ExchangeService(exchangeRepository, exchangeApiService)

        exchangeApiService.convert = jest.fn().mockResolvedValueOnce(undefined);

        const error = new InternalServerErrorException('error on conversion')

        expect(async () => sevice.transaction({
          from: ValidCurrency.EUR,
          to: ValidCurrency.BRL,
          value: 10,
        }, user)).rejects.toThrow(error)
    })

    it('should create', async () => {
      const sevice = new ExchangeService(exchangeRepository, exchangeApiService)

      exchangeApiService.convert = jest.fn().mockResolvedValueOnce({
        rate: 10,
        result: 10,
      });

      const result: Exchange = {
        from: ValidCurrency.EUR,
        to: ValidCurrency.BRL,
        id: "test",
        originValue: 10,
        rate: 10,
        resultValue: 10,
        transactionDate: new Date(),
        user,
      }

      exchangeRepository.save = jest.fn().mockResolvedValueOnce(result)

      expect(await sevice.transaction({
        from: ValidCurrency.EUR,
        to: ValidCurrency.BRL,
        value: 10,
      }, user)).toEqual({
        from: result.from, 
        to: result.to, 
        originValue: result.originValue,
        resultValue: result.resultValue,
        rate: result.rate, 
        transactionDate: result.transactionDate,
        userId: result.user.id,
        transactionId: result.id
      })
    })
  })

  describe('getAllTransactions', () => {
    it('should return the transactions', async () => {
      const sevice = new ExchangeService(exchangeRepository, exchangeApiService)

      exchangeApiService.convert = jest.fn().mockResolvedValueOnce({
        rate: 10,
        result: 10,
      });

      const result: Exchange = {
        from: ValidCurrency.EUR,
        to: ValidCurrency.BRL,
        id: "test",
        originValue: 10,
        rate: 10,
        resultValue: 10,
        transactionDate: new Date(),
        user,
      }

      exchangeRepository.find = jest.fn().mockResolvedValueOnce(result)

      expect(await sevice.getAllTransactions(user)).toEqual(result)
    })
  })
})