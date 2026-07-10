import { PartialType } from "@nestjs/swagger";
import { CreatePackageDto } from "./package.dto";

export class UpdatePackageDto extends PartialType(CreatePackageDto) {}