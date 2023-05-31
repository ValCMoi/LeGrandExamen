import { element } from "src/enum/element/element.enum"
import { StatName } from "src/enum/statName/statName.enum"

export type Stat = {
    nom:element|StatName
    valeur:number
}