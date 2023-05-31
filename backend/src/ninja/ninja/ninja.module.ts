import { Module } from '@nestjs/common';
import { NinjaService } from './ninja.service';
import { NinjaController } from './ninja.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ninja } from './entities/ninja.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Ninja]),
  ],
  controllers: [NinjaController],
  providers: [NinjaService]
})
export class NinjaModule {}
