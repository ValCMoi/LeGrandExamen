import { Module } from '@nestjs/common';
import { NinjaService } from './ninja.service';
import { NinjaController } from './ninja.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ninja } from './entities/ninja.entity';
import { Item } from 'src/item/entities/item.entity';
import { ItemService } from 'src/item/item.service';

@Module({
  imports:[
    TypeOrmModule.forFeature([Ninja, Item]),
  ],
  controllers: [NinjaController],
  providers: [NinjaService, ItemService],
  exports:[NinjaService]
})
export class NinjaModule {}
