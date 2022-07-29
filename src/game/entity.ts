import { ABILITY, ENTITY, ENTITY_ATTRIBUTES } from "./constants";
import * as trig from "./trigonometry";
import { Pos } from "./trigonometry";

export type Attributes = {
  /** range of move ability */
  moveRange: number;
  /** range of abilities */
  abilityRange: number;
  /** block this amount on every incoming instance of damage */
  shield: number;
  /** Determines build cost, attack damage and several other things. */
  size: number;
  /** Set of all abilities that this entity can use. */
  abilities: Set<ABILITY>;
  /** Set of all entities that this entity can build. */
  buildableEntities: Set<ENTITY>;
  /** Allow using drain ability on this entity if true. */
  isDrainable: boolean;
};

export type Entity = {
  id: number;
  type: ENTITY;
  owner: number;
  energy: number;
  pos: Pos;
};

export type EntityNumbers = [id: number, type: ENTITY, owner: number, energy: number, x: number, y: number];

export type CommandNumbers = number[];

export function numbersFromEntity(e: Entity): EntityNumbers {
  return [e.id, e.type, e.owner, e.energy, e.pos[0], e.pos[1]];
}

export function entityFromNumbers(v: EntityNumbers | number[]): Entity {
  return {
    id: v[0],
    type: v[1],
    owner: v[2],
    energy: v[3],
    pos: [v[4], v[5]],
  };
}

export function newEntity(id: number, type: ENTITY, owner: number, pos: Pos): Entity {
  return {
    id,
    type,
    owner,
    energy: ENTITY_ATTRIBUTES[type].size * 10,
    pos,
  };
}

export function newEntityNumbers(id: number, type: ENTITY, owner: number, pos: Pos) {
  return numbersFromEntity(newEntity(id, type, owner, pos));
}

export function isEntityType(i: number | ENTITY) {
  return ENTITY[i] !== undefined;
}

export function hasAbility(origin: Entity, i: ABILITY | number) {
  return ENTITY_ATTRIBUTES[origin.type].abilities.has(i);
}

function canReach(origin: Entity, target: Entity) {
  return trig.isWithinDist(origin.pos, target.pos, ENTITY_ATTRIBUTES[origin.type].abilityRange);
}

/** return new position */
export function move(origin: Entity, targetPos: Pos): Pos {
  const attr = ENTITY_ATTRIBUTES[origin.type];

  const moveSpeed = attr.moveRange;
  const canReach = trig.dist(origin.pos, targetPos) <= moveSpeed;
  if (canReach) {
    return targetPos;
  } else {
    return trig.translateTowards(origin.pos, targetPos, moveSpeed);
  }
}

/** return energy spent and dmg recieved by target if can reach. will be 0 on both if cant reach */
export function attack(origin: Entity, target: Entity): { spent: number; dmg: number } {
  const attr = ENTITY_ATTRIBUTES[origin.type];
  if (canReach(origin, target)) {
    const spent = Math.min(origin.energy, attr.size);
    const dmg = 2 * spent - ENTITY_ATTRIBUTES[target.type].shield;
    return { spent, dmg };
  } else {
    return { spent: 0, dmg: 0 };
  }
}

/** return energy transferred */
export function transfer(origin: Entity, target: Entity): number | undefined {
  const attr = ENTITY_ATTRIBUTES[origin.type];
  if (canReach(origin, target)) {
    const transferred = Math.min(origin.energy, attr.size);
    return transferred;
  } else {
    return undefined;
  }
}

/** return energy drained */
export function drain(origin: Entity, target: Entity): number | undefined {
  const attr = ENTITY_ATTRIBUTES[origin.type];
  if (ENTITY_ATTRIBUTES[target.type].isDrainable && canReach(origin, target)) {
    const drained = Math.min(target.energy, attr.size);
    return drained;
  } else {
    return undefined;
  }
}

/** return energy gained */
export function regen(origin: Entity): number {
  const attr = ENTITY_ATTRIBUTES[origin.type];
  return attr.size;
}

/** return energy spent and the build entity */
export function build(
  origin: Entity,
  entityType: ENTITY,
  newId: number,
): { spent: number; newEntity: Entity } | undefined {
  const attr = ENTITY_ATTRIBUTES[origin.type];

  if (attr.buildableEntities.has(entityType)) {
    const buildCost = ENTITY_ATTRIBUTES[entityType].size * 10;
    if (buildCost > origin.energy) return undefined;

    const ent: Entity = {
      id: newId,
      type: entityType,
      owner: origin.owner, //same owner
      pos: origin.pos, //TODO(@andersgee): generate new random? pos
      energy: ENTITY_ATTRIBUTES[entityType].size * 10,
    };

    return { spent: buildCost, newEntity: ent };
  } else {
    return undefined;
  }
}

export function decisionStrFromNumbers(v: number[]): string {
  return `${v[0]} ${ABILITY[v[1]!]} ${v.slice(2)}`;
}
