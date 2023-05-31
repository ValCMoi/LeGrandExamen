import { element as elementEnum } from "src/enum/element/element.enum";
import { StatName } from "src/enum/statName/statName.enum";
import { Statable } from "src/interface/statable";
import { Stat } from "src/type/stat.type";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Ninja implements Statable{

    @PrimaryGeneratedColumn('uuid')
    id:string

    @Column({default:0})
    eau:number

    @Column({default:0})
    feu:number

    @Column({default:0})
    bois:number

    @Column({default:0})
    metal:number

    @Column({default:0})
    terre:number

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
        return {nom:StatName.VIE, valeur:Math.abs(this.eau - this.bois) + this.terre}
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
}
