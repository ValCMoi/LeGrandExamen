import { Injectable } from '@nestjs/common';
import { CreateStatDto } from './dto/create-stat.dto';
import { UpdateStatDto } from './dto/update-stat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Stat } from './entities/stat.entity';
import { Repository } from 'typeorm';
import { Observable, from } from 'rxjs';

@Injectable()
export class StatService {

  constructor(
    @InjectRepository(Stat)
    private readonly repoStat: Repository<Stat>
  ){}

  create(createStatDto: CreateStatDto):Observable<Stat> | undefined {
    return from(this.repoStat.save(createStatDto));
  }

  findAll():Observable<Stat[]> | undefined {
    return from((this.repoStat.find()));
  }

  async findOne(id: string):Promise<Observable<Stat> | undefined> {
    const aStat:Observable<Stat>|undefined = await from((this.repoStat.findOne({ where: { id: id } })))
    return aStat;
  }

  update(id: string, updateStatDto: UpdateStatDto) {
    return `This action updates a #${id} stat`;
  }

  remove(id: string) {
    return `This action removes a #${id} stat`;
  }
}
