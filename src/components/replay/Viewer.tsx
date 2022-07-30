import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ABILITY, ENTITY, ENTITY_ATTRIBUTES } from "src/game/constants";
import { EntityNumbers, CommandNumbers, Entity, entityFromNumbers, isEntityType } from "src/game/entity";
import { useEventListener } from "usehooks-ts";
import { motion } from "framer-motion";
import { useWindowSize } from "usehooks-ts";

import type { Replay } from "src/pages/replay/[id]";

type ReplayData = [commands: CommandNumbers[], entitynumbers: EntityNumbers[]][];

type Props = {
  className?: string;
  replay: Replay;
};

const ABILITYCOLOR = new Map([
  [ABILITY.MOVE, "#fff"],
  [ABILITY.ATTACK, "#f00"],
  [ABILITY.TRANSFER, "#0f0"],
  [ABILITY.DRAIN, "#00f"],
  [ABILITY.REGEN, "#0ff"],
  [ABILITY.BUILD, "#f0f"],
]);

const SCROLL_ZOOM_SPEED = 1 / 1000;

const abilityColor = (i?: number) => (i ? ABILITYCOLOR.get(i) || "#ccc" : "#ccc");

const btn = "text-neutral-100 bg-neutral-700 p-2";

const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(x, a));

/**
 * scaled so that zoom 0 is 16x zoomed out
 * zoom 0 would be 16:1 (16 times larger svg than window size)
 * zoom 4 would be 1:1
 */
const factorFromZoom = (zoom: number) => 16 / Math.pow(2, zoom);

export function Viewer(props: Props) {
  //maybe validate that data is array and the each element has an array in element[0] and at element[1]
  const data = props.replay.replayData?.data as ReplayData;
  const maxTicks = data.length - 1;

  const [tick, setTick] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [tickDuration, setTickDuration] = useState(0.1);
  const [backanim, setBackanim] = useState(false);

  const mouseDownPosRef = useRef<[number, number] | null>(null);

  const [zoom, setZoom] = useState(4);
  const [center, setCenter] = useState<[number, number]>([0, 0]);

  const gotoFirstTick = useCallback(() => {
    setTick(0);
    setIsPaused(true);
    setBackanim(false);
  }, []);
  const gotoLastTick = useCallback(() => {
    setTick(maxTicks);
    setIsPaused(true);
    setBackanim(false);
  }, [maxTicks]);
  const decrementTick = useCallback(() => {
    setTick((prev) => Math.max(0, prev - 1));
    setBackanim(true);
  }, []);
  const incrementTick = useCallback(() => {
    setTick((prev) => Math.min(maxTicks, prev + 1));
    setBackanim(false);
  }, [maxTicks]);

  const togglePlay = () => {
    if (isPaused) {
      setIsPaused(false);
      incrementTick(); //trigger next instantly instead of after tickduration
    } else {
      setIsPaused(true);
    }

    //setIsPaused((prev) => !prev);
  };

  useEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      decrementTick();
      setIsPaused(true);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      incrementTick();
      setIsPaused(true);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      gotoFirstTick();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      gotoLastTick();
    } else if (e.key === " ") {
      e.preventDefault(); //alow space to be clicked even if just clicked with mouse on a button
      togglePlay();
    }
  });

  useEventListener("wheel", (e) => {
    setZoom((prev) => clamp(prev - e.deltaY * SCROLL_ZOOM_SPEED, 2, 10));
  });

  useEventListener("mousemove", (e) => {
    const f = factorFromZoom(zoom);
    const pos: [number, number] = [e.clientX * f, e.clientY * f];

    if (mouseDownPosRef.current) {
      const newPos: [number, number] = [pos[0] - mouseDownPosRef.current[0], pos[1] - mouseDownPosRef.current[1]];
      setCenter(newPos);
    }
  });

  useEventListener("mousedown", (e) => {
    const f = factorFromZoom(zoom);
    const pos: [number, number] = [e.clientX * f - center[0], e.clientY * f - center[1]];
    mouseDownPosRef.current = pos;
  });
  useEventListener("mouseup", (e) => {
    mouseDownPosRef.current = null;
  });

  useEffect(() => {
    const timer = setInterval(incrementTick, tickDuration * 1000);
    if (isPaused) {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [tickDuration, maxTicks, isPaused, incrementTick]);

  useEffect(() => {
    if (tick >= maxTicks) {
      setIsPaused(true);
    }
  }, [tick, maxTicks]);

  const prevEntitynumbers = useMemo(() => data[tick - 1]?.[1] || [], [data, tick]);
  const entitynumbers = useMemo(() => data[tick]?.[1] || [], [data, tick]);
  const commands = useMemo(() => data[tick]?.[0] || [], [data, tick]);

  //for reverse animation
  const nextEntitynumbers = useMemo(() => data[tick + 1]?.[1] || [], [data, tick]);

  return (
    <>
      <TickRenderer
        zoom={zoom}
        center={center}
        tick={tick}
        tickDuration={tickDuration}
        backanim={backanim}
        commands={commands}
        entitynumbers={entitynumbers}
        prevEntitynumbers={prevEntitynumbers}
        nextEntitynumbers={nextEntitynumbers}
      />
      <div className="absolute right-0 flex gap-2">
        <button className={btn} onClick={togglePlay}>
          PLAY / PAUSE
        </button>

        <button className={btn} onClick={gotoFirstTick}>
          GOTO BEGIN
        </button>
      </div>

      <div className="absolute right-0 top-12 flex gap-2">
        <button className={btn} onClick={() => setTickDuration(1.6)}>
          1.6s
        </button>
        <button className={btn} onClick={() => setTickDuration(0.8)}>
          0.8s
        </button>
        <button className={btn} onClick={() => setTickDuration(0.4)}>
          0.4s
        </button>
        <button className={btn} onClick={() => setTickDuration(0.2)}>
          0.2
        </button>
        <button className={btn} onClick={() => setTickDuration(0.1)}>
          0.1s
        </button>
        <button className={btn} onClick={() => setTickDuration(0.05)}>
          0.05s
        </button>
      </div>
    </>
  );
}

/**
 * expected zooms are something like 16 - 20 but just scale differently otherwize
 * this "resolution = constant / 2^zoom" stuff is what mapbox uses so should feel intuitive?
 */
/*
const viewBoxString = (zoom: number, windowWidth: number, windowHeight: number, center: [x: number, y: number]) => {
  const width = (100 * windowWidth) / Math.pow(2, zoom);
  const height = width;
  const minX = width * 0.5;
  const minY = height * 0.5;
  const x = center[0];
  const y = center[1];
  return `-${minX - x} -${minY - y} ${width} ${height}`;
};
*/

function viewBoxString(zoom: number, windowWidth: number, windowHeight: number, center: [x: number, y: number]) {
  const w = windowWidth * factorFromZoom(zoom);
  const h = windowHeight * factorFromZoom(zoom);
  const dx = center[0]; //center refers to the game coordinates aka the svg
  const dy = center[1];
  const translated = `${-w * 0.5 - dx} ${-h * 0.5 - dy} ${w} ${h}`;
  return translated;
}

type TickRendererProps = {
  zoom: number;
  center: [number, number];
  tick: number;
  tickDuration: number;
  backanim: boolean;
  commands: CommandNumbers[];
  entitynumbers: EntityNumbers[];
  prevEntitynumbers: EntityNumbers[];
  nextEntitynumbers: EntityNumbers[];
};

export function TickRenderer(props: TickRendererProps) {
  const { width, height } = useWindowSize();

  const entities = new Map<number, Entity>(
    props.entitynumbers.map((numbers) => [numbers[0], entityFromNumbers(numbers)]),
  );
  const prevEntities = new Map<number, Entity>(
    props.prevEntitynumbers.map((numbers) => [numbers[0], entityFromNumbers(numbers)]),
  );
  const nextEntities = new Map<number, Entity>(
    props.nextEntitynumbers.map((numbers) => [numbers[0], entityFromNumbers(numbers)]),
  );

  const fromEntities = props.backanim ? nextEntities : prevEntities;

  const playerColorsDark = ["hsl(50 80% 50% / 0.9)", "hsl(150 80% 50% / 0.9)", "#ccc"];
  const playerColorsLight = ["hsl(65 80% 50% / 0.9)", "hsl(165 80% 50% / 0.9)", "#ccc"];

  return (
    <motion.svg
      className="absolute w-screen h-screen overflow-scroll bg-neutral-900"
      //viewBox={`-${width * 0.5} -${height * 0.5} ${width} ${height}`}
      viewBox={viewBoxString(props.zoom, width, height, props.center)}
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {playerColorsDark.map((c, i) => (
          <linearGradient key={i} id={`c${i}`} gradientTransform="rotate(90)">
            <stop offset="10%" stopColor={playerColorsDark[i]} />
            <stop offset="90%" stopColor={playerColorsLight[i]} />
          </linearGradient>
        ))}
      </defs>

      {props.commands.map((command) => abilityShape(props.tick, props.tickDuration, command, entities, fromEntities))}
      {props.entitynumbers.map((entitynumbers) =>
        entityShape(props.tick, props.tickDuration, entitynumbers, entities, fromEntities),
      )}
    </motion.svg>
  );
}

function abilityShape(
  tick: number,
  tickDuration: number,
  command: CommandNumbers,
  entities: Map<number, Entity>,
  prevEntities: Map<number, Entity>,
) {
  const id = command[0];
  const ability = command[1];

  if (id === undefined || ability === undefined) return null;

  if (ability === ABILITY.MOVE) {
    return abilityMoveShape(tick, tickDuration, command, entities, prevEntities);
  } else if (ability === ABILITY.ATTACK || ability === ABILITY.DRAIN || ability === ABILITY.TRANSFER) {
    return abilityEnergizeShape(tick, tickDuration, command, entities, prevEntities);
  }

  return null;
}

function entityShape(
  tick: number,
  tickDuration: number,
  entity: EntityNumbers,
  entities: Map<number, Entity>,
  prevEntities: Map<number, Entity>,
) {
  const id = entity[0];
  const type = entity[1] as ENTITY;
  const owner = entity[2];
  const x = entity[4];
  const y = entity[5];

  if (!isEntityType(type)) return null;

  const size = ENTITY_ATTRIBUTES[type].size;
  const r = Math.sqrt(size / Math.PI);

  const prevEntity = prevEntities.get(id) || entities.get(id);
  if (!prevEntity) {
    //TODO: trigger spawn animation instead.
    return null;
  }

  const fromX = prevEntity.pos[0];
  const fromY = prevEntity.pos[1];

  //something unique, make framer trigger animation when this changes
  const key = `${id}-${tick}`;
  return (
    <motion.circle
      key={key}
      animate={{ cx: [fromX, x], cy: [fromY, y] }}
      transition={{ ease: "linear", duration: tickDuration, times: [0, 1] }}
      cx={fromX}
      cy={fromY}
      r={r}
      fill={`url(#c${owner})`}
    />
  );
  //return <motion.circle key={`e${id}`} fill="#00f" cx={x} cy={y} />;
}

function abilityMoveShape(
  tick: number,
  tickDuration: number,
  command: CommandNumbers,
  entities: Map<number, Entity>,
  prevEntities: Map<number, Entity>,
) {
  const id = command[0];
  const ability = command[1];
  const targetId = command[2];
  const args = command.slice(3);
  if (!id || !targetId) return null;

  const entity = entities.get(id);
  const prevEntity = prevEntities.get(id);
  if (!entity || !prevEntity) {
    return null;
  }

  const fromPos = prevEntity.pos;
  const toPos = entity.pos;

  const fromX = fromPos[0];
  const fromY = fromPos[1];
  const x = toPos[0];
  const y = toPos[1];

  //const d = `M ${x} ${y} L ${tx} ${ty}`;

  //something unique, make framer trigger animation when this changes
  const key = `${id}-${ability}-${tick}`;
  return (
    <motion.line
      key={key}
      animate={{ x2: [fromX, x], y2: [fromY, y], strokeOpacity: [1, 0] }}
      transition={{ ease: "linear", duration: tickDuration }}
      x1={fromX}
      y1={fromY}
      x2={fromX}
      y2={fromY}
      stroke={abilityColor(ability)}
      strokeWidth="2"
      strokeLinecap="round"
      strokeOpacity="0"
    />
  );
  /*
  return (
    <motion.path
      key={key}
      animate={{ strokeOpacity: [0, 1, 0] }}
      transition={{ ease: "easeOut", duration: tickDuration, times: [0, 0.999, 1] }}
      stroke={abilityColor(ability)}
      strokeWidth="2"
      strokeLinecap="round"
      d={d}
    />
  );
  */
}

function abilityEnergizeShape(
  tick: number,
  tickDuration: number,
  command: CommandNumbers,
  entities: Map<number, Entity>,
  prevEntities: Map<number, Entity>,
) {
  const id = command[0];
  const ability = command[1];
  const targetId = command[2];
  const args = command.slice(3);
  if (!id || !targetId) return null;

  const entity = prevEntities.get(id) || entities.get(id);
  const targetEntity = prevEntities.get(targetId) || entities.get(targetId);
  if (!entity || !targetEntity) {
    return null;
  }

  const originPos = entity.pos;
  const targetPos = targetEntity.pos;

  const x = originPos[0];
  const y = originPos[1];
  const tx = targetPos[0];
  const ty = targetPos[1];

  const d = `M ${x} ${y} L ${tx} ${ty}`;

  //something unique, make framer trigger animation when this changes
  const key = `${id}-${ability}-${tick}`;
  return (
    <motion.path
      key={key}
      animate={{ strokeOpacity: [0, 1, 0] }}
      transition={{ ease: "easeIn", duration: tickDuration, times: [0, 0.2, 0.5] }}
      strokeOpacity="0"
      stroke={abilityColor(ability)}
      strokeWidth="2"
      strokeLinecap="round"
      d={d}
    />
  );
}
