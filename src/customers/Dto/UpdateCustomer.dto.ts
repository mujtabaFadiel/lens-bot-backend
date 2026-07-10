import { PartialType } from "@nestjs/swagger";
import { CustomersDto } from "./customers.dto";

export class UpdateCustomerDto extends PartialType(CustomersDto) {}