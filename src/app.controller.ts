import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import {
  MakeABetCommand,
  MakeABetUseCase,
} from './core/application/use-cases/make-a-bet.usecase';
import { IdProvider } from './core/application/id-provider';

@Controller()
export class AppController {
  constructor(
    private readonly makeABetUsecase: MakeABetUseCase,
    private readonly idProvider: IdProvider,
  ) {}

  @Post('/bet')
  async makeABet(
    @Body()
    body: Omit<MakeABetCommand, 'id'>,
  ) {
    const makeABetCommand: MakeABetCommand = {
      id: this.idProvider.provide(),
      ...body,
    };

    const result = await this.makeABetUsecase.execute(makeABetCommand);

    if (result.isErr()) {
      throw new BadRequestException(result.error.message);
    }
  }
}
