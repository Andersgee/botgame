import { ABILITY } from "./constants";
import {
  attack,
  build,
  drain,
  Entity,
  entityFromNumbers,
  EntityNumbers,
  hasAbility,
  move,
  newEntityId,
  numbersFromEntity,
  regen,
  transfer,
  CommandNumbers,
} from "./entity";
import { Pos } from "./trigonometry";

function applyCommandNumbers(entityNumbersList: EntityNumbers[], commandNumbersList: CommandNumbers[]) {
  const entities = new Map<number, Entity>(
    entityNumbersList.map((numbers) => [numbers[0], entityFromNumbers(numbers)]),
  );
  const updatedEntities = new Map<number, Entity>(
    entityNumbersList.map((numbers) => [numbers[0], entityFromNumbers(numbers)]),
  );

  const usedmoveEntityIds = new Set<number>();
  const usedAbilityEntityIds = new Set<number>();

  /** a list of all decisions executed this tick */
  const executedCommands: number[][] = [];

  for (const command of commandNumbersList) {
    const player = command[0];
    const id = command[1];
    const ability = command[2];
    if (player === undefined || id === undefined || ability === undefined) continue;

    const entity = entities.get(id);
    const updatedEntity = updatedEntities.get(id);
    if (entity === undefined || updatedEntity === undefined) continue;

    if (entity.owner !== player) continue;

    if (ability === ABILITY.MOVE && !usedmoveEntityIds.has(id) && hasAbility(entity, ABILITY.MOVE)) {
      //expect command = [player, id, ability, x,y]
      if (command[3] === undefined || command[4] === undefined) continue;
      const pos = [command[3], command[4]] as Pos;
      const newPos = move(entity, pos);
      updatedEntity.pos = newPos;
      usedmoveEntityIds.add(id);
      executedCommands.push([id, ABILITY.MOVE, newPos[0], newPos[1]]);
    }

    if (usedAbilityEntityIds.has(id)) continue;

    if (ability === ABILITY.ATTACK && hasAbility(entity, ABILITY.ATTACK)) {
      //expect command = [player, id, ability, targetId]
      if (command[3] === undefined) continue;
      const targetId = command[3];

      if (id === targetId) continue;

      const targetEntity = entities.get(targetId);
      const updatedTargetEntity = updatedEntities.get(targetId);
      if (targetEntity === undefined || updatedTargetEntity === undefined) continue;

      const { spent, dmg } = attack(entity, targetEntity);
      updatedEntity.energy -= spent;
      updatedTargetEntity.energy -= dmg;
      usedAbilityEntityIds.add(id);
      executedCommands.push([id, ABILITY.ATTACK, targetId]);
    } else if (ability === ABILITY.TRANSFER && hasAbility(entity, ABILITY.TRANSFER)) {
      //expect command = [player, id, ability, targetId]
      if (command[3] === undefined) continue;
      const targetId = command[3];
      if (id === targetId) continue;

      const targetEntity = entities.get(targetId);
      const updatedTargetEntity = updatedEntities.get(targetId);
      if (targetEntity === undefined || updatedTargetEntity === undefined) continue;

      const spent = transfer(entity, targetEntity);
      if (spent == undefined) continue;
      updatedEntity.energy -= spent;
      updatedTargetEntity.energy += spent;
      usedAbilityEntityIds.add(id);
      executedCommands.push([id, ABILITY.TRANSFER, targetId]);
    } else if (ability === ABILITY.DRAIN && hasAbility(entity, ABILITY.DRAIN)) {
      //expect command = [player, id, ability, targetId]
      if (command[3] === undefined) continue;
      const targetId = command[3];
      if (id === targetId) continue;

      const targetEntity = entities.get(targetId);
      const updatedTargetEntity = updatedEntities.get(targetId);
      if (targetEntity === undefined || updatedTargetEntity === undefined) continue;

      const spent = drain(entity, targetEntity);
      if (spent == undefined) continue;
      updatedEntity.energy -= spent;
      updatedTargetEntity.energy += spent;
      usedAbilityEntityIds.add(id);
      executedCommands.push([id, ABILITY.DRAIN, targetId]);
    } else if (ability === ABILITY.REGEN && hasAbility(entity, ABILITY.REGEN)) {
      //expect command = [player, id, ability]
      const gained = regen(entity);
      updatedEntity.energy += gained;
      usedAbilityEntityIds.add(id);
      executedCommands.push([id, ABILITY.REGEN]);
    } else if (ability === ABILITY.BUILD && hasAbility(entity, ABILITY.BUILD)) {
      //expect command = [player, id, ability, entityType]
      if (command[3] === undefined) continue;
      const entityType = command[3];

      const newId = newEntityId(updatedEntities);
      const res = build(entity, entityType, newId);
      if (res === undefined) continue;

      updatedEntity.energy -= res.spent;
      updatedEntities.set(newId, res.newEntity);

      usedAbilityEntityIds.add(id);
      executedCommands.push([id, ABILITY.BUILD, entityType]);
    }
  }

  updatedEntities.forEach((v, k) => {
    if (v.energy < 0) {
      updatedEntities.delete(k);
    }
  });

  const updatedState = Array.from(updatedEntities).map(([id, entity]) => numbersFromEntity(entity));

  return { updatedState, decisionNumbers: executedCommands };
}
