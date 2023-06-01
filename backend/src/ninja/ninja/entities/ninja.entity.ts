import { Inject, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Observable, from } from "rxjs";
import { element as elementEnum } from "src/enum/element/element.enum";
import { StatName } from "src/enum/statName/statName.enum";
import { Statable } from "src/interface/statable";
import { Item } from "src/item/entities/item.entity";
import { ItemService } from "src/item/item.service";
import { Stat } from "src/type/stat.type";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Repository } from "typeorm";

@Entity()
export class Ninja{

    constructor(
        @InjectRepository(Item)
        private readonly itemRepo: Repository<Item>,
        @InjectRepository(Ninja)
        private readonly ninjaRepo: Repository<Ninja>
    ){}

    @PrimaryGeneratedColumn('uuid')
    id:string

    @Column({default:"Ninja"})
    nom:string

    @Column({default:"Description"})
    description:string

    @Column({default:1})
    eau:number

    @Column({default:1})
    feu:number

    @Column({default:1})
    bois:number

    @Column({default:1})
    metal:number

    @Column({default:1})
    terre:number

    @Column({
            type:"enum",
            enum:elementEnum,
            default:elementEnum.EAU 
        }
    )
    elemSpe:string

    @OneToMany(() => Item, item => item.ninja)
    inventaire: Item[];

    enumKeys<O extends object, K extends keyof O = keyof O>(obj: O): K[] {
        return Object.keys(obj).filter(k => Number.isNaN(+k)) as K[];
    }

    getEau():Stat{
        return {nom: elementEnum.EAU, valeur: this.eau}
    }
    
    getFeu():Stat{
        return {nom: elementEnum.FEU, valeur: this.feu}
    }

    getBois():Stat{
        return {nom: elementEnum.BOIS, valeur: this.bois}
    }

    getTerre():Stat{
        return {nom: elementEnum.TERRE, valeur: this.terre}
    }

    getMetal():Stat{
        return {nom: elementEnum.METAL, valeur: this.metal}
    }


    getPhysique():Stat{
        return {nom: StatName.PHYSIQUE, valeur: this.metal + this.eau}
    }    

    getMental():Stat{
        return {nom: StatName.MENTAL, valeur:this.bois + this.feu}
    }
    
    getDexterite():Stat{
        return {nom:StatName.DEXTERITE , valeur:Math.abs(this.eau - this.feu)}
    }

    
    getAgilite():Stat{
        return {nom:StatName.AGILITE , valeur:Math.abs(this.bois - this.metal)}
    }

    getVie():Stat{ 
        return {nom:StatName.VIE, valeur:10 * Math.abs(this.eau - this.bois) + this.terre + 10 * this[`get${this.elemSpe.slice(0,1).toUpperCase() + this.elemSpe.slice(1)}`]().valeur}
    }

    getResistance():Stat{
        return {nom:StatName.RESISTANCE, valeur:Math.abs(this.metal - this.feu) + this.terre}
    }

    getChakra():Stat{
        const listStats:Stat[] = [this.getEau(), this.getFeu(), this.getBois(), this.getMetal(), this.getTerre()] 
        const listValeur= listStats.map(el => el.valeur)
        return {nom:StatName.CHAKRA, valeur:Math.max(...listValeur) + Math.min(...listValeur) + this.getTerre().valeur}
    }

    getTailleInventaire():Stat{
        return {nom:StatName.TAILLE_INVENTAIRE, valeur:4}
    }

    getStats():Stat[]{

        let res:Stat[] = []

        for(const statElem of this.enumKeys(elementEnum)){
            const methodName:string = `get${elementEnum[statElem].slice(0,1).toUpperCase() + elementEnum[statElem].slice(1)}`
            const aStat:Stat = (this[methodName as keyof Ninja] as () => Stat) ();
            res.push(aStat)
        }

        for(const statEnum of this.enumKeys(StatName)){
            const methodName = (`get${StatName[statEnum].slice(0,1).toUpperCase()}${StatName[statEnum].slice(1)}`)
            const aStat:Stat = (this[methodName as keyof Ninja] as () => Stat) ();
            res.push(aStat)
        }

        /**
         * Calcul bonus
         */

        return res
    }

    getCapacitesStat(statName: string, valeur:number = 0):{description:string,}{
        let res = ""

        switch (statName) {
            case StatName.AGILITE:
                if(valeur >= 2 && valeur <= 1 ){
                    res = "esquive réduite"
                }
                if(valeur === 3 ){
                    res = "+1dé6 au joueur pour le calcul des esquives"
                }
                if(valeur >= 4 ){
                    res = "contre attaque possible"
                }
                break;
            case StatName.CHAKRA:
                res=""
                break;
            case StatName.DEXTERITE:
                if(valeur >= 2 && valeur <= 1 ){
                    res = " 1 arme dans les mains"
                }
                if(valeur === 3 ){
                    res = "2 armes dans les mains"
                }
                if(valeur >= 4 ){
                    res = "3 armes 2 dans les mains + 1 en bouche"
                }
                break;        
            case StatName.MENTAL:
                if(valeur === 5 ){
                    res = " +1 score final d'une tentative"
                }
                if(valeur > 5 && valeur <= 7 ){
                    res = " +2 score final d'une tentative"
                }
                if(valeur >= 8 ){
                    res = " +2 score final d'une tentative + ajout d'une relance d'un dé possible"
                }
                break;
            case StatName.PHYSIQUE:
                if(valeur === 5 ){
                    res = " +1 dégât"
                }
                if(valeur > 5 && valeur <= 7 ){
                    res = " +2 dégât"
                }
                if(valeur >= 8 ){
                    res = " +3 dégât"
                }
                break;
            case StatName.RESISTANCE:
                res = `-${valeur} aux dégâts subit`
                break;
            }
            

        return {description:res}
    }
}
