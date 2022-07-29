import { Attributes } from "./entity";

export enum ENTITY {
  STAR,
  ASTEROID,
  SHIPYARD,
  CORVETTE,
  DESTROYER,
  CRUISER,
  BATTLESHIP,
}

export enum ABILITY {
  MOVE,
  ATTACK,
  TRANSFER,
  DRAIN,
  REGEN,
  BUILD,
}

const defaultAttributes: Attributes = {
  isDrainable: false,
  shield: 0,
  abilityRange: 0,
  moveRange: 0,
  size: 0,
  abilities: new Set(),
  buildableEntities: new Set(),
};

export const ENTITY_ATTRIBUTES: Record<ENTITY, Attributes> = {
  [ENTITY.STAR]: {
    ...defaultAttributes,
    size: 64,
    isDrainable: true,
    abilities: new Set([ABILITY.REGEN]),
  },
  [ENTITY.ASTEROID]: {
    ...defaultAttributes,
    size: 4,
    isDrainable: true,
  },
  [ENTITY.CORVETTE]: {
    ...defaultAttributes,
    size: 4,
    moveRange: 28,
    abilityRange: 160,
    shield: 1,
    abilities: new Set([ABILITY.MOVE, ABILITY.ATTACK, ABILITY.TRANSFER, ABILITY.DRAIN]),
  },
  [ENTITY.DESTROYER]: {
    ...defaultAttributes,
    size: 8,
    moveRange: 24,
    abilityRange: 180,
    shield: 2,
    abilities: new Set([ABILITY.MOVE, ABILITY.ATTACK, ABILITY.TRANSFER, ABILITY.DRAIN]),
  },
  [ENTITY.CRUISER]: {
    ...defaultAttributes,
    size: 16,
    moveRange: 20,
    abilityRange: 200,
    shield: 3,
    abilities: new Set([ABILITY.MOVE, ABILITY.ATTACK, ABILITY.TRANSFER, ABILITY.DRAIN]),
  },
  [ENTITY.BATTLESHIP]: {
    ...defaultAttributes,
    size: 32,
    moveRange: 16,
    abilityRange: 220,
    shield: 4,
    abilities: new Set([ABILITY.MOVE, ABILITY.ATTACK, ABILITY.TRANSFER, ABILITY.DRAIN]),
  },
  [ENTITY.SHIPYARD]: {
    ...defaultAttributes,
    size: 64,
    moveRange: 1,
    abilityRange: 240,
    shield: 5,
    abilities: new Set([ABILITY.MOVE, ABILITY.ATTACK, ABILITY.TRANSFER, ABILITY.DRAIN, ABILITY.BUILD]),

    buildableEntities: new Set([ENTITY.CORVETTE, ENTITY.DESTROYER, ENTITY.CRUISER, ENTITY.BATTLESHIP, ENTITY.SHIPYARD]),
  },
} as const;
