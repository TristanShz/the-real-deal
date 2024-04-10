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
import { RegisterCommandSchema } from './core/application/use-cases/register/register.command';
import { RegisterUseCase } from './core/application/use-cases/register/register.usecase';

@Controller()
export class AppController {
  constructor(
    private readonly makeABetUseCase: MakeABetUseCase,
    private readonly registerUseCase: RegisterUseCase,
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
      id: this.idProvider.generate(),
      ...body,
    };

    const result = await this.makeABetUseCase.execute(makeABetCommand);

    if (result.isErr()) {
      throw new HttpException(result.error.message, 400);
    }
  }

  @Post('/register')
  async register(@Body() body: any) {
    const parseResult = RegisterCommandSchema.safeParse(body);

    if (!parseResult.success) {
      throw new BadRequestException(parseResult.error, {
        cause: parseResult.error,
        description: parseResult.error.message,
      });
    }

    const result = await this.registerUseCase.execute(parseResult.data);

    if (result.isErr()) {
      throw new HttpException(result.error.message, 400);
    }
  }
}
