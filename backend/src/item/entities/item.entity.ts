import { Ninja } from "src/ninja/ninja/entities/ninja.entity";
import { Stat } from "src/stat/entities/stat.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Item {
    @PrimaryGeneratedColumn('uuid')
    id:string

    @Column({default:"Item"})
    nom:string

    @Column({default:"Item"})
    description:string

    @Column({default:1})
    taille:number

    @OneToMany(() => Stat, stat => stat.item)
    stats: Item[];

    @ManyToOne(() => Ninja, ninja => ninja.inventaire)
    ninja: Ninja;
}
