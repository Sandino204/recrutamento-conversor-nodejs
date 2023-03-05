import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { User } from '../auth/entities/user.entity';
import { GetUser } from '../auth/get-user.decorator';
import { JWTAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ConvertApiPayload } from './dto/convert-api-payload.dto';
import { ExchangeService } from './exchange.service';

@Controller('exchange')
export class ExchangeController {
    constructor(
        private exchangeService: ExchangeService
    ) {}

    @Get('/')
    @UseGuards(JWTAuthGuard)
    async getAll( @GetUser() user: User) {
        return this.exchangeService.getAllTransactions(user)
    }
    
    @Post('/')
    @UseGuards(JWTAuthGuard)
    async transaction(@Body() payload: ConvertApiPayload, @GetUser() user: User) {
        return this.exchangeService.transaction(payload, user)
    }
}
