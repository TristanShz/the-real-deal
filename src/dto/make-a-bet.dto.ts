import { IsInt, IsInt } from "class-validator";

export class MakeABetDto {
  @IsInt()
  amount: number;

  @IsInt()
  odds: number;

  
