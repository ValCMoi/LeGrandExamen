import { PartialType } from '@nestjs/swagger';
import { CreateNinjaDto } from './create-ninja.dto';

export class UpdateNinjaDto extends PartialType(CreateNinjaDto) {}
