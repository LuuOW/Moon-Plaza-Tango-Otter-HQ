import React, { useState, useEffect, useRef } from 'react';
import { Character, FurnitureItem, Direction } from '../types';
import {
  TILE_WIDTH,
  TILE_HEIGHT,
  GRID_SIZE,
  gridToScreen,
  screenToGrid,
  getDepth,
  getDirection,
} from '../utils/isometric';
import { HabboAvatarSprite } from './HabboAvatarSprite';
import { IsometricFurniture } from './IsometricFurniture';
import { sounds } from '../utils/sound';
import { MessageSquare, Sparkles, Coffee, Server, DollarSign, Zap } from 'lucide-react';

interface IsometricRoomCanvasProps {
  characters: Character[];
  furniture: FurnitureItem[];
  onPlayerMove: (x: number, y: number) => void;
  onCharacterClick: (character: Character) => void;
  onFurnitureClick: (item: FurnitureItem) => void;
  isBrainstorming: boolean;
}

export const IsometricRoomCanvas: React.FC<IsometricRoomCanvasProps> = ({
  characters,
  furniture,
  onPlayerMove,
  onCharacterClick,
  onFurnitureClick,
  isBrainstorming,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [frame, setFrame] = useState(0);
  const [hoveredTile, setHoveredTile] = useState<{ x: number; y: number } | null>(null);
  const [hoveredCharacterId, setHoveredCharacterId] = useState<string | null>(null);
  const [hoveredFurnitureId, setHoveredFurnitureId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);

  // Animation ticker for sprites and effects
  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((f) => (f + 1) % 60);
    }, 120);
    return () => clearInterval(interval);
  }, []);

  // Origin point of the isometric grid inside the viewport
  const originX = 460;
  const originY = 160;

  // Handle stage click -> Move player
  const handleStageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) / zoom;
    const clickY = (e.clientY - rect.top) / zoom;

    const grid = screenToGrid(clickX, clickY, originX, originY, TILE_WIDTH, TILE_HEIGHT);

    // Validate boundaries
    if (grid.x >= 0 && grid.x < GRID_SIZE && grid.y >= 0 && grid.y < GRID_SIZE) {
      sounds.playStep();
      onPlayerMove(grid.x, grid.y);
    }
  };

  // Handle mouse move for tile hover preview
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const moveX = (e.clientX - rect.left) / zoom;
    const moveY = (e.clientY - rect.top) / zoom;

    const grid = screenToGrid(moveX, moveY, originX, originY, TILE_WIDTH, TILE_HEIGHT);
    if (grid.x >= 0 && grid.x < GRID_SIZE && grid.y >= 0 && grid.y < GRID_SIZE) {
      setHoveredTile(grid);
    } else {
      setHoveredTile(null);
    }
  };

  // Build grid tiles for rendering floor
  const floorTiles = [];
  for (let gx = 0; gx < GRID_SIZE; gx++) {
    for (let gy = 0; gy < GRID_SIZE; gy++) {
      const screenPos = gridToScreen(gx, gy, originX, originY, TILE_WIDTH, TILE_HEIGHT);
      const isCheckered = (gx + gy) % 2 === 0;
      const isRug = gx >= 3 && gx <= 7 && gy >= 3 && gy <= 7;
      const isCenter = gx === 5 && gy === 5;
      const isHovered = hoveredTile?.x === gx && hoveredTile?.y === gy;

      let tileFill = isCheckered ? '#1E293B' : '#0F172A';
      if (isRug) {
        tileFill = isCheckered ? '#1E1B4B' : '#312E81'; // Velvet rug
      }
      if (isCenter) {
        tileFill = '#3730A3';
      }

      floorTiles.push({
        gx,
        gy,
        screenX: screenPos.x,
        screenY: screenPos.y,
        fill: tileFill,
        isHovered,
        isRug,
      });
    }
  }

  // Combine entities (characters & furniture) for z-index depth sorting
  const entities: Array<{
    type: 'character' | 'furniture';
    depth: number;
    data: any;
    screenX: number;
    screenY: number;
  }> = [];

  furniture.forEach((item) => {
    const screenPos = gridToScreen(item.x, item.y, originX, originY, TILE_WIDTH, TILE_HEIGHT);
    entities.push({
      type: 'furniture',
      depth: getDepth(item.x + 0.5, item.y + 0.5, -5),
      data: item,
      screenX: screenPos.x,
      screenY: screenPos.y,
    });
  });

  characters.forEach((char) => {
    const screenPos = gridToScreen(char.x, char.y, originX, originY, TILE_WIDTH, TILE_HEIGHT);
    entities.push({
      type: 'character',
      depth: getDepth(char.x, char.y, 10),
      data: char,
      screenX: screenPos.x,
      screenY: screenPos.y,
    });
  });

  // Sort entities from back to front
  entities.sort((a, b) => a.depth - b.depth);

  return (
    <div className="relative w-full h-full min-h-[580px] bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 overflow-hidden select-none rounded-xl border border-slate-800 shadow-2xl flex flex-col justify-center items-center">
      {/* Top Floating Controls & Indicators */}
      <div className="absolute top-4 left-4 z-30 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/60 shadow-lg text-xs">
        <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
        <span className="font-mono-code font-bold text-slate-200">MOON PLAZA HQ</span>
        <span className="text-slate-500">|</span>
        <span className="text-amber-400 font-pixel text-[10px]">TANGO OTTER</span>
      </div>

      {isBrainstorming && (
        <div className="absolute top-4 right-4 z-30 flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1.5 rounded-lg text-xs font-semibold backdrop-blur-md animate-pulse">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>Company All-Hands In Progress...</span>
        </div>
      )}

      {/* Zoom / View controls */}
      <div className="absolute bottom-4 right-4 z-30 flex items-center gap-1 bg-slate-900/80 backdrop-blur-md p-1 rounded-lg border border-slate-700/60 shadow-lg">
        <button
          onClick={() => setZoom(Math.max(0.8, zoom - 0.15))}
          className="px-2 py-1 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded transition font-mono-code"
          title="Zoom Out"
        >
          -
        </button>
        <span className="text-[11px] font-mono-code text-slate-400 px-1">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => setZoom(Math.min(1.5, zoom + 0.15))}
          className="px-2 py-1 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded transition font-mono-code"
          title="Zoom In"
        >
          +
        </button>
        <button
          onClick={() => setZoom(1)}
          className="px-2 py-1 text-[10px] text-amber-400 hover:bg-slate-800 rounded transition font-mono-code ml-1"
          title="Reset View"
        >
          100%
        </button>
      </div>

      {/* Main Isometric Stage Viewport */}
      <div
        ref={containerRef}
        onClick={handleStageClick}
        onMouseMove={handleMouseMove}
        className="relative w-full h-[620px] cursor-crosshair isometric-stage flex justify-center items-center"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: 'center center',
          transition: 'transform 0.15s ease-out',
        }}
      >
        {/* Isometric SVG Background Backdrop (Walls & Windows) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
          style={{ width: '100%', height: '100%' }}
        >
          {/* North-West Wall (Left Wall) */}
          <polygon
            points={`
              ${originX},${originY - 140}
              ${originX - (GRID_SIZE * TILE_WIDTH) / 2},${originY + (GRID_SIZE * TILE_HEIGHT) / 2 - 140}
              ${originX - (GRID_SIZE * TILE_WIDTH) / 2},${originY + (GRID_SIZE * TILE_HEIGHT) / 2}
              ${originX},${originY}
            `}
            fill="#0F172A"
            stroke="#1E293B"
            strokeWidth="2"
          />

          {/* North-East Wall (Right Wall) */}
          <polygon
            points={`
              ${originX},${originY - 140}
              ${originX + (GRID_SIZE * TILE_WIDTH) / 2},${originY + (GRID_SIZE * TILE_HEIGHT) / 2 - 140}
              ${originX + (GRID_SIZE * TILE_WIDTH) / 2},${originY + (GRID_SIZE * TILE_HEIGHT) / 2}
              ${originX},${originY}
            `}
            fill="#1E293B"
            stroke="#334155"
            strokeWidth="2"
          />

          {/* Left Wall Habbo Windows showing Moon & Starry Night */}
          <polygon
            points={`
              ${originX - 160},${originY - 50}
              ${originX - 280},${originY + 10}
              ${originX - 280},${originY + 70}
              ${originX - 160},${originY + 10}
            `}
            fill="#020617"
            stroke="#38BDF8"
            strokeWidth="2"
          />
          {/* Glowing Moon in Window */}
          <circle cx={originX - 220} cy={originY} r="14" fill="#FDE047" opacity="0.9" />
          <circle cx={originX - 215} cy={originY - 2} r="12" fill="#020617" />
          {/* Stars */}
          <circle cx={originX - 250} cy={originY - 10} r="1.5" fill="#FFFFFF" />
          <circle cx={originX - 190} cy={originY + 20} r="1.2" fill="#FFFFFF" />
          <circle cx={originX - 265} cy={originY + 30} r="1.5" fill="#38BDF8" />

          {/* Right Wall Neon Sign "ASK MERIDIAN" */}
          <polygon
            points={`
              ${originX + 140},${originY - 50}
              ${originX + 270},${originY + 15}
              ${originX + 270},${originY + 55}
              ${originX + 140},${originY - 10}
            `}
            fill="#090D16"
            stroke="#F59E0B"
            strokeWidth="1.5"
          />
          <text
            x={originX + 195}
            y={originY}
            fill="#F59E0B"
            fontSize="10"
            fontWeight="bold"
            fontFamily="'Press Start 2P', monospace"
            transform={`rotate(26, ${originX + 195}, ${originY})`}
            textAnchor="middle"
          >
            MERIDIAN
          </text>

          {/* Floor Isometric Tiles */}
          {floorTiles.map((tile, i) => (
            <g key={`tile-${tile.gx}-${tile.gy}`}>
              <polygon
                points={`
                  ${tile.screenX},${tile.screenY}
                  ${tile.screenX + TILE_WIDTH / 2},${tile.screenY + TILE_HEIGHT / 2}
                  ${tile.screenX},${tile.screenY + TILE_HEIGHT}
                  ${tile.screenX - TILE_WIDTH / 2},${tile.screenY + TILE_HEIGHT / 2}
                `}
                fill={tile.isHovered ? '#F59E0B' : tile.fill}
                fillOpacity={tile.isHovered ? 0.4 : 1}
                stroke="#1E293B"
                strokeWidth="1"
                className="transition-colors duration-150"
              />
              {/* Tile grid lines */}
              <line
                x1={tile.screenX}
                y1={tile.screenY + TILE_HEIGHT}
                x2={tile.screenX}
                y2={tile.screenY + TILE_HEIGHT + 2}
                stroke="#0F172A"
                strokeWidth="0.5"
              />
            </g>
          ))}
        </svg>

        {/* Dynamic Entities Layer (Furniture, Avatars, Speech Bubbles) */}
        {entities.map((entity, idx) => {
          if (entity.type === 'furniture') {
            const item: FurnitureItem = entity.data;
            const isHovered = hoveredFurnitureId === item.id;

            return (
              <div
                key={item.id}
                onMouseEnter={() => setHoveredFurnitureId(item.id)}
                onMouseLeave={() => setHoveredFurnitureId(null)}
                className="absolute pointer-events-auto transition-transform"
                style={{
                  left: entity.screenX,
                  top: entity.screenY,
                  zIndex: entity.depth,
                }}
              >
                <IsometricFurniture
                  item={item}
                  frame={frame}
                  isHovered={isHovered}
                  onClick={() => onFurnitureClick(item)}
                />

                {/* Hover Tooltip */}
                {isHovered && item.interactionTooltip && (
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900/95 text-amber-300 border border-amber-500/40 text-[11px] px-2.5 py-1 rounded shadow-xl whitespace-nowrap z-50 pointer-events-none font-medium animate-in fade-in">
                    {item.interactionTooltip}
                  </div>
                )}
              </div>
            );
          }

          if (entity.type === 'character') {
            const char: Character = entity.data;
            const isHovered = hoveredCharacterId === char.id;

            return (
              <div
                key={char.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onCharacterClick(char);
                }}
                onMouseEnter={() => setHoveredCharacterId(char.id)}
                onMouseLeave={() => setHoveredCharacterId(null)}
                className="absolute pointer-events-auto cursor-pointer flex flex-col items-center"
                style={{
                  left: entity.screenX,
                  top: entity.screenY - 25,
                  transform: 'translate(-50%, -50%)',
                  zIndex: entity.depth,
                }}
              >
                {/* Habbo-style Speech Bubble Floating Above Head */}
                {char.currentBubble && (
                  <div
                    className={`absolute -top-20 z-50 max-w-[220px] px-3 py-1.5 rounded-lg border-2 shadow-2xl animate-in zoom-in-95 duration-150 ${
                      char.currentBubble.isIdea
                        ? 'bg-amber-400 text-slate-950 border-amber-600 font-bold'
                        : 'bg-white text-slate-900 border-slate-900'
                    }`}
                  >
                    <p className="text-xs font-sans-ui leading-tight text-center break-words">
                      {char.currentBubble.text}
                    </p>
                    {/* Habbo bubble tail */}
                    <div
                      className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[7px] ${
                        char.currentBubble.isIdea
                          ? 'border-t-amber-400'
                          : 'border-t-white'
                      }`}
                    />
                  </div>
                )}

                {/* Character Sprite */}
                <HabboAvatarSprite
                  avatar={char.avatar}
                  direction={char.direction}
                  action={char.action}
                  scale={1.05}
                  frame={frame}
                  isHovered={isHovered}
                />

                {/* Name & Role Tag beneath avatar */}
                <div
                  className={`mt-1 px-2 py-0.5 rounded-md text-[10px] font-mono-code font-bold whitespace-nowrap shadow-md transition-all ${
                    char.isPlayer
                      ? 'bg-amber-500 text-slate-950 ring-1 ring-amber-300'
                      : 'bg-slate-900/90 text-slate-200 border border-slate-700'
                  }`}
                >
                  {char.name}
                  <span className="text-[8px] text-slate-400 block text-center font-normal">
                    {char.role}
                  </span>
                </div>
              </div>
            );
          }

          return null;
        })}
      </div>

      {/* Bottom Hint Banner */}
      <div className="absolute bottom-4 left-4 z-30 text-[11px] text-slate-400 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 flex items-center gap-2">
        <span className="font-bold text-slate-300">Controls:</span>
        <span>Click floor to walk</span>
        <span>•</span>
        <span>Click characters or furniture to interact</span>
        <span>•</span>
        <span className="text-amber-400 font-semibold">Speak below to brainstorm with company</span>
      </div>
    </div>
  );
};
