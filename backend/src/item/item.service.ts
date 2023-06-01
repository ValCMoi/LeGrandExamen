import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Observable, from } from 'rxjs';
import { Item } from './entities/item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ninja } from 'src/ninja/ninja/entities/ninja.entity';
import { NinjaService } from 'src/ninja/ninja/ninja.service';

@Injectable()
export class ItemService {

  constructor(
    @InjectRepository(Item)
    private readonly repoItem: Repository<Item>,
    @Inject(forwardRef(() => NinjaService))
    private readonly serviceNinja: NinjaService,
  ){}

  create(createItemDto: CreateItemDto) {
    return 'This action adds a new item';
  }

  findAll() {
    return from(this.repoItem.find({
      relations: ['ninja', 'stats']
    }));
  }

  findOne(id: number) {
    return `This action returns a #${id} item`;
  }

  update(id: number, updateItemDto: UpdateItemDto) {
    return `This action updates a #${id} item`;
  }

  remove(id: number) {
    return `This action removes a #${id} item`;
  }

  async getItemsOfNinja(uuid:string):Promise<Item[] | undefined>{
    const aNinja = await this.serviceNinja.findOneNinja(uuid)
    const res = await (this.repoItem.find({where:{ninja: aNinja}, relations:['stats']}))
    return res
  }
}
