import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConvertApiPayload } from './dto/convert-api-payload.dto';
import { ConvertApiResponse } from './dto/convert-api-response';
import { ApiResponse } from './interfaces/api-response.interface';

@Injectable()
export class ExchangeApiService {
  private urlBase: string;

  constructor(
    private readonly httpService: HttpService
  ) {
    this.urlBase = "https://api.apilayer.com/exchangerates_data/convert"
  }

  public async convert(payload: ConvertApiPayload): Promise<ConvertApiResponse> {
    try {
      const response = await this.httpService.axiosRef
        .get(this.urlBase + `?to=${payload.to}&from=${payload.from}&amount=${payload.value}`, 
        {
            headers: {
                'apikey': '',
            }
        })

      const data: ApiResponse = response?.data;

      return {
        rate: data.info.rate,
        result: data.result
      }
    } catch(e) {
        throw new InternalServerErrorException()
    }
  } 
}
