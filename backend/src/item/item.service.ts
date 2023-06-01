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
    return this.repoItem.save(createItemDto);
  }

  findAll() {
    return from(this.repoItem.find({
      relations: ['ninja', 'stats']
    }));
  }

  findOne(id: string) {
    return from(this.repoItem.findOne({
      where:{id:id},
      relations: ['ninja', 'stats']
    }));  }

  update(id: string, updateItemDto: UpdateItemDto) {  
    return this.repoItem.update(id,updateItemDto);
  }

  async remove(id: string) {
    const entityToDelete: Item = await this.findOne(id).toPromise()
    this.repoItem.remove(entityToDelete)
    return 'Delete successfull';
  }

  async getItemsOfNinja(uuid:string):Promise<Item[] | undefined>{
    const aNinja = await this.serviceNinja.findOneNinja(uuid)
    const res = await (this.repoItem.find({where:{ninja: aNinja}, relations:['stats']}))
    return res
  }
}
