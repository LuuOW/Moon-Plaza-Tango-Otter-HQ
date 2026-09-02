/**
 * Isometric Math Utilities for Moon Plaza: Tango Otter HQ
 * Standard 2:1 Habbo Hotel Isometric Projection
 */

export const TILE_WIDTH = 72;
export const TILE_HEIGHT = 36;
export const GRID_SIZE = 11;

export interface Point2D {
  x: number;
  y: number;
}

export function gridToScreen(
  gx: number,
  gy: number,
  originX: number,
  originY: number,
  tileW: number = TILE_WIDTH,
  tileH: number = TILE_HEIGHT
): Point2D {
  return {
    x: originX + (gx - gy) * (tileW / 2),
    y: originY + (gx + gy) * (tileH / 2),
  };
}

export function screenToGrid(
  sx: number,
  sy: number,
  originX: number,
  originY: number,
  tileW: number = TILE_WIDTH,
  tileH: number = TILE_HEIGHT
): Point2D {
  const dx = sx - originX;
  const dy = sy - originY;
  const halfW = tileW / 2;
  const halfH = tileH / 2;

  const gx = (dy / halfH + dx / halfW) / 2;
  const gy = (dy / halfH - dx / halfW) / 2;

  return {
    x: Math.floor(gx),
    y: Math.floor(gy),
  };
}

export function getDepth(gx: number, gy: number, extraOffset: number = 0): number {
  return Math.round((gx + gy) * 100) + extraOffset;
}

export function getDistance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

export function getDirection(fromX: number, fromY: number, toX: number, toY: number): 0 | 1 | 2 | 3 {
  const dx = toX - fromX;
  const dy = toY - fromY;

  if (Math.abs(dx) >= Math.abs(dy)) {
    return dx >= 0 ? 0 : 2; // 0: SE, 2: NW
  } else {
    return dy >= 0 ? 1 : 3; // 1: SW, 3: NE
  }
}
