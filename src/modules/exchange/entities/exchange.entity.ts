import { User } from '../../auth/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';

export enum ValidCurrency {
  USD = "USD",
  BRL = "BRL",
  EUR = "EUR",
  JPY = "JPY"
}

@Entity({ name: 'exchange' })
export class Exchange {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ValidCurrency,
  })
  from: ValidCurrency;

  @Column({
    type: 'enum',
    enum: ValidCurrency,
  })
  to: ValidCurrency;

  @Column('decimal')
  originValue: number;

  @Column('decimal')
  resultValue: number;

  @Column('decimal')
  rate: number;

  @Column()
  transactionDate: Date;

  @ManyToOne(() => User, (user) => user)
  user: User
}