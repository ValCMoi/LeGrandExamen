import { element } from "src/enum/element/element.enum";
import { StatName } from "src/enum/statName/statName.enum";
import { Item } from "src/item/entities/item.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Stat {

    @PrimaryGeneratedColumn('uuid')
    id:string

    @Column(
        {
            type:"enum",
            enum: {...element, ...StatName},
            default: element.EAU,
            nullable:false
        }
    )
    nom:string

    @Column({default:1, nullable:false})
    valeur:number

    @ManyToOne(() => Item, item => item.stats)
    item: Item;
}
