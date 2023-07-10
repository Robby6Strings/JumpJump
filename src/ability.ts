export enum AbilityType {
  Unset = "Unset",
  SlowMo = "SlowMo",
}

export class Ability {
  constructor(public type: AbilityType = AbilityType.Unset) {
    console.log("Ability")
  }
}
