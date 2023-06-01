import { Injectable } from '@nestjs/common';
import { CreateNinjaDto } from './dto/create-ninja.dto';
import { UpdateNinjaDto } from './dto/update-ninja.dto';
import { Repository } from 'typeorm';
import { Ninja } from './entities/ninja.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable, from } from 'rxjs';
import { Stat } from 'src/type/stat.type';
import { element as elementEnum} from 'src/enum/element/element.enum';
import { ItemService } from 'src/item/item.service';
import { StatName } from 'src/enum/statName/statName.enum';

@Injectable()
export class NinjaService {

  constructor(
    @InjectRepository(Ninja)
    private readonly repoNinja:Repository<Ninja>,
    private readonly itemService:ItemService
    ){}


  enumKeys<O extends object, K extends keyof O = keyof O>(obj: O): K[] {
      return Object.keys(obj).filter(k => Number.isNaN(+k)) as K[];
  }

  create(createNinjaDto: CreateNinjaDto):Observable<Ninja> | undefined {
    return from(this.repoNinja.save(createNinjaDto));
  }

  findAll():Observable<Ninja[]> | undefined {
    return from((this.repoNinja.find()));
  }

  async findOneNinja(id: string):Promise<Object> {
    const aNinja:Ninja = await (this.repoNinja.findOneOrFail({where:{id:id}}))
    return aNinja;
  }

  /**
   * Retourne les stats d un ninja sans bonus
   * @param id 
   * @returns 
   */
  async findOneNinjaStat(id: string):Promise<Stat[] | undefined> {
    const aNinja:Ninja = await (this.repoNinja.findOne({where:{id:id}}))
    return aNinja.getStats();
  }

  /**
   *    * Retourne les stats d un ninja avec bonus
   * @param id 
   * @returns 
   */
  async findOneNinjaFullStat(id:string){
    let aNinja:Ninja = await (this.repoNinja.findOne({where:{id:id}, relations:['inventaire']}))
    
    let res:Stat[] = []
    let inventaireStats:Stat[] = []

    res = aNinja.getStats()


    await this.itemService.getItemsOfNinja(aNinja.id).then(data => {
      data.forEach(item => {
        item.stats.forEach(stat => {
          if(!inventaireStats.find(aStat => aStat.nom === stat.nom)){
            inventaireStats.push(stat as unknown as Stat)
          }else{
            inventaireStats.map(aStat => {
              if(aStat.nom === (stat as unknown as Stat).nom){
                aStat.valeur += (stat as unknown as Stat).valeur
              }
            })
          }          
        });
      })      
    })
    /**
     * Attribution bonus element
     */
    for(let elemStat of this.enumKeys(elementEnum)){
      inventaireStats.filter(statBonus => statBonus.nom === elementEnum[elemStat]).forEach(statBonus => {
        aNinja[elementEnum[elemStat]] += statBonus.valeur
      })
    }

    console.table(aNinja.getStats())
    res = aNinja.getStats()


    /**
     * Attribution bonus skill
     */
    for(let stat of this.enumKeys(StatName)){
      inventaireStats.filter(statBonus => statBonus.nom === StatName[stat]).forEach(statBonus => {
        res.map(aStat =>{
          if(aStat.nom === StatName[stat]){
            aStat.valeur += statBonus.valeur
          }        
        }
        )
      })
    }
    const resStat = res
    return {global:{nom:aNinja.nom, description:aNinja.description, elemSpe:aNinja.elemSpe},stats:resStat, inventaire:await this.itemService.getItemsOfNinja(aNinja.id)}
  }


  update(id: number, updateNinjaDto: UpdateNinjaDto) {
    return `This action updates a #${id} ninja`;
  }

  remove(id: number) {
    return `This action removes a #${id} ninja`;
  }
}
