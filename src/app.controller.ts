import {
  BadRequestException,
  Body,
  Controller,
  HttpException,
  Post,
} from '@nestjs/common';
import { IdProvider } from './core/application/ports/id-provider';
import { MakeABetUseCase } from './core/application/use-cases/make-a-bet/make-a-bet.usecase';
import {
  MakeABetCommand,
  MakeABetCommandSchema,
} from './core/application/use-cases/make-a-bet/make-a-bet.command';

@Controller()
export class AppController {
  constructor(
    private readonly makeABetUsecase: MakeABetUseCase,
    private readonly idProvider: IdProvider,
  ) {}

  @Post('/bet')
  async makeABet(
    @Body()
    body: any,
  ) {
    const parseResult = MakeABetCommandSchema.omit({ id: true }).safeParse(
      body,
    );

    if (!parseResult.success) {
      throw new BadRequestException(parseResult.error, {
        cause: parseResult.error,
        description: parseResult.error.message,
      });
    }

    const makeABetCommand: MakeABetCommand = {
      id: this.idProvider.provide(),
      ...body,
    };

    const result = await this.makeABetUsecase.execute(makeABetCommand);

    if (result.isErr()) {
      throw new HttpException(result.error.message, 400);
    }
  }
}
