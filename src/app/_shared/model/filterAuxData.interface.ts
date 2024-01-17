import { Season, Weapon, Wma } from "@model";

export interface FilterAuxData {
  wmas: Wma[];
  filteredWmas: Wma[];
  seasons: Season[];
  weapons: Weapon[];
}
