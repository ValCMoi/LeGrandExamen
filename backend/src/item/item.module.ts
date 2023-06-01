import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { Item } from './entities/item.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ninja } from 'src/ninja/ninja/entities/ninja.entity';
import { NinjaService } from 'src/ninja/ninja/ninja.service';

@Module({
  imports:[
    TypeOrmModule.forFeature([Item, Ninja]),
  ],
  controllers: [ItemController],
  providers: [ItemService, NinjaService],
  exports: [ItemService]
})
export class ItemModule {}
