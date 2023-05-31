import { Injectable } from '@nestjs/common';
import { CreateNinjaDto } from './dto/create-ninja.dto';
import { UpdateNinjaDto } from './dto/update-ninja.dto';
import { Repository } from 'typeorm';
import { Ninja } from './entities/ninja.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable, from } from 'rxjs';
import { Stat } from 'src/type/stat.type';

@Injectable()
export class NinjaService {

  constructor(
    @InjectRepository(Ninja)
    private readonly repoNinja:Repository<Ninja>){}

  create(createNinjaDto: CreateNinjaDto):Observable<Ninja> | undefined {
    return from(this.repoNinja.save(createNinjaDto));
  }

  findAll() {
    return `This action returns all ninja`;
  }

  async findOne(id: string):Promise<Stat[] | undefined> {
    const aNinja:Ninja = await (this.repoNinja.findOne({where:{id:id}}))
    return aNinja.getStats();
  }

  update(id: number, updateNinjaDto: UpdateNinjaDto) {
    return `This action updates a #${id} ninja`;
  }

  remove(id: number) {
    return `This action removes a #${id} ninja`;
  }
}
