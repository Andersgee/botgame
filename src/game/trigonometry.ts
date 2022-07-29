/*
//3d
export type Pos = [x: number, y: number, z: number];
export type Vec = [x: number, y: number, z: number];

export const add = (v1: Vec, v2: Vec): Vec => [v1[0] + v2[0], v1[1] + v2[1], v1[2] + v2[2]];
export const mul = (v: Vec, k: number): Vec => [v[0] * k, v[1] * k, v[2] * k];
export const div = (v: Vec, k: number): Vec => [v[0] / k, v[1] / k, v[2] / k];
export const dot = (v1: Vec, v2: Vec) => v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
export const vec = (from: Pos, to: Pos): Vec => [to[0] - from[0], to[1] - from[1], to[2] - from[2]];
*/

//2d
export type Pos = [x: number, y: number];
export type Vec = [x: number, y: number];

export const add = (v1: Vec, v2: Vec): Vec => [v1[0] + v2[0], v1[1] + v2[1]];
export const mul = (v: Vec, k: number): Vec => [v[0] * k, v[1] * k];
export const div = (v: Vec, k: number): Vec => [v[0] / k, v[1] / k];
export const dot = (v1: Vec, v2: Vec) => v1[0] * v2[0] + v1[1] * v2[1];
export const vec = (from: Pos, to: Pos): Vec => [to[0] - from[0], to[1] - from[1]];

//generic
export const len = (v: Vec) => Math.sqrt(dot(v, v));
export const squaredLen = (v: Vec) => dot(v, v);
export const normalize = (v: Vec) => div(v, len(v));
export const scaleToLen = (v: Vec, len: number) => mul(normalize(v), len);
export const dist = (p1: Pos, p2: Pos): number => len(vec(p1, p2));
export const isWithinDist = (p1: Pos, p2: Pos, d: number) => dist(p1, p2) <= d;
export const translate = (p: Pos, v: Vec): Pos => add(p, v);
export const translateTowards = (from: Pos, to: Pos, distance: number): Pos =>
  translate(from, scaleToLen(vec(from, to), distance));
