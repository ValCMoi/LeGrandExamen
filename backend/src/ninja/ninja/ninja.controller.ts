import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NinjaService } from './ninja.service';
import { CreateNinjaDto } from './dto/create-ninja.dto';
import { UpdateNinjaDto } from './dto/update-ninja.dto';

@Controller('ninja')
export class NinjaController {
  constructor(private readonly ninjaService: NinjaService) {}

  @Post()
  create(@Body() createNinjaDto: CreateNinjaDto) {
    return this.ninjaService.create(createNinjaDto);
  }

  @Get()
  findAll() {
    return this.ninjaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ninjaService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNinjaDto: UpdateNinjaDto) {
    return this.ninjaService.update(+id, updateNinjaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ninjaService.remove(+id);
  }
}
