import { Stat } from "src/type/stat.type";

export interface Statable{
    getStats():Stat[]
}