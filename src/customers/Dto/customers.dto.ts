import { IsNotEmpty, IsString } from "class-validator";

export class CustomersDto {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsNotEmpty()
    phone!: string
}