import React from 'react';
import { FurnitureItem } from '../types';

interface IsometricFurnitureProps {
  item: FurnitureItem;
  frame?: number;
  isHovered?: boolean;
  onClick?: () => void;
}

export const IsometricFurniture: React.FC<IsometricFurnitureProps> = ({
  item,
  frame = 0,
  isHovered = false,
  onClick,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) onClick();
  };

  switch (item.type) {
    case 'desk':
      return (
        <div
          onClick={handleClick}
          className={`relative select-none cursor-pointer transition-transform duration-100 ${
            isHovered ? 'scale-105' : ''
          }`}
          style={{ width: 140, height: 100, transform: 'translate(-50px, -60px)' }}
        >
          <svg viewBox="0 0 140 100" width="140" height="100" className="overflow-visible">
            {/* Floor shadow */}
            <polygon points="10,50 70,20 130,50 70,80" fill="rgba(0,0,0,0.3)" />

            {/* Desk Top */}
            <polygon points="20,40 70,15 120,40 70,65" fill="#334155" stroke="#1E293B" strokeWidth="1.5" />
            <polygon points="20,40 70,65 70,72 20,47" fill="#1E293B" />
            <polygon points="70,65 120,40 120,47 70,72" fill="#0F172A" />

            {/* Metal Legs */}
            <line x1="24" y1="46" x2="24" y2="70" stroke="#64748B" strokeWidth="2.5" />
            <line x1="116" y1="46" x2="116" y2="70" stroke="#475569" strokeWidth="2.5" />
            <line x1="70" y1="70" x2="70" y2="90" stroke="#334155" strokeWidth="2.5" />

            {/* Monitor 1 */}
            <polygon points="45,28 65,18 65,34 45,44" fill="#0F172A" stroke="#0284C7" strokeWidth="1" />
            {/* Screen code glow */}
            <polygon points="47,30 63,21 63,33 47,42" fill="#0369A1" />
            <line x1="49" y1="34" x2="60" y2="28" stroke="#38BDF8" strokeWidth="1" />
            <line x1="50" y1="38" x2="58" y2="34" stroke="#4ADE80" strokeWidth="1" />

            {/* Monitor 2 */}
            <polygon points="75,20 95,30 95,46 75,36" fill="#0F172A" stroke="#8B5CF6" strokeWidth="1" />
            <polygon points="77,22 93,31 93,43 77,34" fill="#6D28D9" />
            <line x1="79" y1="28" x2="90" y2="34" stroke="#C084FC" strokeWidth="1" />
            <line x1="80" y1="32" x2="88" y2="36" stroke="#FBBF24" strokeWidth="1" />

            {/* Keyboard & Desk Mat */}
            <polygon points="56,46 70,39 84,46 70,53" fill="#09090B" />

            {/* Label badge */}
            {item.label && (
              <g transform="translate(42, 68)">
                <rect x="0" y="0" width="56" height="14" rx="3" fill="#0F172A" stroke="#475569" strokeWidth="1" />
                <text x="28" y="10" fill="#E2E8F0" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                  {item.label}
                </text>
              </g>
            )}
          </svg>
        </div>
      );

    case 'server_rack':
      return (
        <div
          onClick={handleClick}
          className={`relative select-none cursor-pointer transition-transform duration-100 ${
            isHovered ? 'scale-105' : ''
          }`}
          style={{ width: 100, height: 140, transform: 'translate(-30px, -90px)' }}
        >
          <svg viewBox="0 0 100 140" width="100" height="140" className="overflow-visible">
            {/* Shadow */}
            <polygon points="10,100 50,80 90,100 50,120" fill="rgba(0,0,0,0.35)" />

            {/* Main Cabinet */}
            {/* Top */}
            <polygon points="20,30 50,15 80,30 50,45" fill="#1E293B" stroke="#0F172A" strokeWidth="1.5" />
            {/* Left face */}
            <polygon points="20,30 50,45 50,110 20,95" fill="#0F172A" stroke="#020617" strokeWidth="1.5" />
            {/* Right face (Server Units) */}
            <polygon points="50,45 80,30 80,95 50,110" fill="#18181B" stroke="#09090B" strokeWidth="1.5" />

            {/* Server unit slots with pulsing LEDs */}
            {[0, 1, 2, 3, 4, 5].map((idx) => {
              const yOff = idx * 10;
              const isPulsing = (frame + idx) % 3 === 0;
              return (
                <g key={idx}>
                  <line
                    x1="54"
                    y1={52 + yOff}
                    x2="76"
                    y2={41 + yOff}
                    stroke="#27272A"
                    strokeWidth="1.5"
                  />
                  {/* Blinking LEDs */}
                  <circle
                    cx="56"
                    cy={51 + yOff}
                    r="1.2"
                    fill={isPulsing ? '#10B981' : '#047857'}
                  />
                  <circle
                    cx="60"
                    cy={49 + yOff}
                    r="1.2"
                    fill={idx % 2 === 0 ? '#38BDF8' : '#F59E0B'}
                  />
                  <circle
                    cx="74"
                    cy={42 + yOff}
                    r="1"
                    fill="#10B981"
                  />
                </g>
              );
            })}

            {/* Glowing GitHub & Moon Plaza Badge */}
            <polygon points="26,50 44,59 44,70 26,61" fill="#0284C7" opacity="0.85" />
            <text x="35" y="62" fill="#FFFFFF" fontSize="5" fontWeight="bold" textAnchor="middle" transform="rotate(26, 35, 62)">
              CI/CD
            </text>
          </svg>
        </div>
      );

    case 'coffee_machine':
      return (
        <div
          onClick={handleClick}
          className={`relative select-none cursor-pointer transition-transform duration-100 ${
            isHovered ? 'scale-105' : ''
          }`}
          style={{ width: 80, height: 90, transform: 'translate(-25px, -55px)' }}
        >
          <svg viewBox="0 0 80 90" width="80" height="90" className="overflow-visible">
            {/* Shadow */}
            <polygon points="10,60 40,45 70,60 40,75" fill="rgba(0,0,0,0.3)" />

            {/* Counter Stand */}
            <polygon points="16,48 40,36 64,48 40,60" fill="#78350F" stroke="#451A03" strokeWidth="1" />
            <polygon points="16,48 40,60 40,72 16,60" fill="#451A03" />
            <polygon points="40,60 64,48 64,60 40,72" fill="#290E02" />

            {/* Coffee Maker Box */}
            <polygon points="26,34 40,27 54,34 40,41" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
            <polygon points="26,34 40,41 40,54 26,47" fill="#CBD5E1" />
            <polygon points="40,41 54,34 54,47 40,54" fill="#94A3B8" />

            {/* Glass Coffee Pot */}
            <ellipse cx="40" cy="48" rx="4" ry="3" fill="#D97706" opacity="0.9" />

            {/* Steam Animation */}
            <path
              d={`M 39 ${22 - (frame % 3)} Q 42 ${18 - (frame % 3)} 39 ${14 - (frame % 3)}`}
              fill="none"
              stroke="rgba(255,255,255,0.7)"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      );

    case 'whiteboard':
      return (
        <div
          onClick={handleClick}
          className={`relative select-none cursor-pointer transition-transform duration-100 ${
            isHovered ? 'scale-105' : ''
          }`}
          style={{ width: 140, height: 110, transform: 'translate(-50px, -70px)' }}
        >
          <svg viewBox="0 0 140 110" width="140" height="110" className="overflow-visible">
            {/* Stand Legs */}
            <line x1="30" y1="50" x2="20" y2="85" stroke="#475569" strokeWidth="3" />
            <line x1="110" y1="50" x2="120" y2="85" stroke="#334155" strokeWidth="3" />

            {/* Whiteboard Face */}
            <polygon points="25,25 70,5 115,25 70,45" fill="#F8FAFC" stroke="#0F172A" strokeWidth="2" />
            <polygon points="25,25 70,45 70,75 25,55" fill="#E2E8F0" stroke="#0F172A" strokeWidth="1.5" />
            <polygon points="70,45 115,25 115,55 70,75" fill="#CBD5E1" stroke="#0F172A" strokeWidth="1.5" />

            {/* Diagrams and Sticky Notes on Board */}
            <rect x="36" y="34" width="10" height="8" fill="#FDE047" stroke="#CA8A04" strokeWidth="0.5" rx="1" />
            <rect x="50" y="40" width="10" height="8" fill="#F472B6" stroke="#DB2777" strokeWidth="0.5" rx="1" />
            <rect x="78" y="35" width="12" height="8" fill="#38BDF8" stroke="#0284C7" strokeWidth="0.5" rx="1" />

            {/* Flowchart lines */}
            <line x1="46" y1="38" x2="50" y2="44" stroke="#475569" strokeWidth="1" strokeDasharray="2,2" />
            <line x1="60" y1="44" x2="78" y2="39" stroke="#10B981" strokeWidth="1.2" />

            {/* Text on board */}
            <text x="48" y="58" fill="#0F172A" fontSize="5" fontWeight="bold" fontFamily="monospace">
              MERIDIAN REVENUE
            </text>
          </svg>
        </div>
      );

    case 'donation_kiosk':
      return (
        <div
          onClick={handleClick}
          className={`relative select-none cursor-pointer transition-transform duration-100 ${
            isHovered ? 'scale-110' : ''
          }`}
          style={{ width: 100, height: 110, transform: 'translate(-35px, -70px)' }}
        >
          <svg viewBox="0 0 100 110" width="100" height="110" className="overflow-visible">
            {/* Shadow */}
            <polygon points="10,75 50,55 90,75 50,95" fill="rgba(0,0,0,0.35)" />

            {/* Kiosk Base Pedestal */}
            <polygon points="30,60 50,50 70,60 50,70" fill="#0F172A" stroke="#1E293B" strokeWidth="1.5" />
            <polygon points="30,60 50,70 50,85 30,75" fill="#020617" />
            <polygon points="50,70 70,60 70,75 50,85" fill="#0F172A" />

            {/* Glowing Pillar */}
            <polygon points="35,40 50,32 65,40 50,48" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5" />
            <polygon points="35,40 50,48 50,65 35,57" fill="#D97706" />
            <polygon points="50,48 65,40 65,57 50,65" fill="#B45309" />

            {/* Floating Gold Coin Animation */}
            <g transform={`translate(0, ${-Math.abs(Math.sin(frame * 0.8)) * 5})`}>
              <ellipse cx="50" cy="20" rx="10" ry="12" fill="#FBBF24" stroke="#B45309" strokeWidth="1.5" />
              <ellipse cx="50" cy="20" rx="7" ry="9" fill="#F59E0B" />
              <text x="50" y="24" fill="#78350F" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                $
              </text>
            </g>

            {/* Badges on front */}
            <rect x="37" y="47" width="12" height="6" fill="#0079C1" rx="1" />
            <text x="43" y="52" fill="#FFFFFF" fontSize="3.5" fontWeight="bold" textAnchor="middle">
              PayPal
            </text>
          </svg>
        </div>
      );

    case 'otter_statue':
      return (
        <div
          onClick={handleClick}
          className={`relative select-none cursor-pointer transition-transform duration-100 ${
            isHovered ? 'scale-110' : ''
          }`}
          style={{ width: 90, height: 110, transform: 'translate(-30px, -70px)' }}
        >
          <svg viewBox="0 0 90 110" width="90" height="110" className="overflow-visible">
            {/* Marble plinth */}
            <polygon points="20,70 45,57 70,70 45,83" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.5" />
            <polygon points="20,70 45,83 45,95 20,82" fill="#CBD5E1" />
            <polygon points="45,83 70,70 70,82 45,95" fill="#94A3B8" />

            {/* Golden Otter Mascot Figurine */}
            <g transform="translate(45, 45)">
              <ellipse cx="0" cy="10" rx="14" ry="10" fill="#FBBF24" stroke="#B45309" strokeWidth="1.5" />
              {/* Head */}
              <circle cx="0" cy="-2" r="10" fill="#FCD34D" stroke="#B45309" strokeWidth="1.5" />
              {/* Ears */}
              <circle cx="-8" cy="-8" r="3" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
              <circle cx="8" cy="-8" r="3" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
              {/* Paws */}
              <circle cx="-5" cy="8" r="3" fill="#F59E0B" />
              <circle cx="5" cy="8" r="3" fill="#F59E0B" />
              {/* Sparkle */}
              {frame % 4 === 0 && (
                <polygon points="-12,-10 -8,-10 -10,-14" fill="#FFFFFF" />
              )}
            </g>

            <text x="45" y="90" fill="#1E293B" fontSize="5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              TANGO OTTER
            </text>
          </svg>
        </div>
      );

    case 'arcade_machine':
      return (
        <div
          onClick={handleClick}
          className={`relative select-none cursor-pointer transition-transform duration-100 ${
            isHovered ? 'scale-105' : ''
          }`}
          style={{ width: 90, height: 130, transform: 'translate(-30px, -85px)' }}
        >
          <svg viewBox="0 0 90 130" width="90" height="130" className="overflow-visible">
            {/* Shadow */}
            <polygon points="10,95 45,77 80,95 45,113" fill="rgba(0,0,0,0.35)" />

            {/* Cabinet body */}
            <polygon points="20,40 45,27 70,40 45,53" fill="#EC4899" stroke="#BE185D" strokeWidth="1.5" />
            <polygon points="20,40 45,53 45,100 20,87" fill="#831843" />
            <polygon points="45,53 70,40 70,87 45,100" fill="#9D174D" />

            {/* Screen */}
            <polygon points="46,55 68,44 68,70 46,81" fill="#020617" stroke="#38BDF8" strokeWidth="1" />
            {/* Animated pixel otter on screen */}
            <rect x="52" y={60 + (frame % 2)} width="6" height="6" fill="#FBBF24" />

            {/* Marquee */}
            <polygon points="46,38 68,27 68,36 46,47" fill="#FDE047" />
            <text x="57" y="40" fill="#831843" fontSize="4.5" fontWeight="bold" textAnchor="middle" transform="rotate(26, 57, 40)">
              HABBO 84
            </text>
          </svg>
        </div>
      );

    case 'plant':
      return (
        <div
          onClick={handleClick}
          className="relative select-none"
          style={{ width: 60, height: 80, transform: 'translate(-20px, -50px)' }}
        >
          <svg viewBox="0 0 60 80" width="60" height="80" className="overflow-visible">
            {/* Pot */}
            <polygon points="18,52 30,46 42,52 30,58" fill="#EA580C" stroke="#9A3412" strokeWidth="1" />
            <polygon points="18,52 30,58 30,68 18,62" fill="#C2410C" />
            <polygon points="30,58 42,52 42,62 30,68" fill="#9A3412" />

            {/* Leaves */}
            <circle cx="30" cy="35" r="14" fill="#15803D" stroke="#166534" strokeWidth="1" />
            <circle cx="22" cy="28" r="10" fill="#22C55E" />
            <circle cx="38" cy="28" r="10" fill="#16A34A" />
            <circle cx="30" cy="20" r="8" fill="#4ADE80" />
          </svg>
        </div>
      );

    case 'sofa':
      return (
        <div
          onClick={handleClick}
          className={`relative select-none cursor-pointer transition-transform duration-100 ${
            isHovered ? 'scale-105' : ''
          }`}
          style={{ width: 130, height: 90, transform: 'translate(-50px, -55px)' }}
        >
          <svg viewBox="0 0 130 90" width="130" height="90" className="overflow-visible">
            {/* Shadow */}
            <polygon points="10,50 65,22 120,50 65,78" fill="rgba(0,0,0,0.3)" />

            {/* Sofa Cushions */}
            <polygon points="20,42 65,19 110,42 65,65" fill="#4338CA" stroke="#312E81" strokeWidth="1.5" />
            <polygon points="20,42 65,65 65,75 20,52" fill="#312E81" />
            <polygon points="65,65 110,42 110,52 65,75" fill="#1E1B4B" />

            {/* Backrest */}
            <polygon points="20,25 65,2 110,25 65,48" fill="#4F46E5" stroke="#312E81" strokeWidth="1.5" />
            <polygon points="20,25 65,48 65,58 20,35" fill="#3730A3" />
            <polygon points="65,48 110,25 110,35 65,58" fill="#312E81" />
          </svg>
        </div>
      );

    case 'banner_pod':
      return (
        <div
          onClick={handleClick}
          className={`relative select-none cursor-pointer transition-transform duration-100 ${
            isHovered ? 'scale-105' : ''
          }`}
          style={{ width: 120, height: 130, transform: 'translate(-40px, -85px)' }}
        >
          <svg viewBox="0 0 120 130" width="120" height="130" className="overflow-visible">
            {/* Shadow */}
            <polygon points="15,95 60,75 105,95 60,115" fill="rgba(0,0,0,0.35)" />

            {/* Pedestal */}
            <polygon points="35,75 60,65 85,75 60,85" fill="#0C4A6E" stroke="#0284C7" strokeWidth="1.5" />
            <polygon points="35,75 60,85 60,95 35,85" fill="#082F49" />
            <polygon points="60,85 85,75 85,85 60,95" fill="#0369A1" />

            {/* Glowing Holographic Billboard Screen */}
            <polygon points="25,35 60,20 95,35 60,50" fill="#0284C7" stroke="#38BDF8" strokeWidth="1.5" opacity="0.9" />
            <polygon points="25,35 60,50 60,75 25,60" fill="#0369A1" stroke="#38BDF8" strokeWidth="1" />
            <polygon points="60,50 95,35 95,60 60,75" fill="#0284C7" stroke="#0EA5E9" strokeWidth="1" />

            {/* Screen Content Graphics */}
            <text x="42" y="52" fill="#E0F2FE" fontSize="5" fontWeight="bold" transform="rotate(22, 42, 52)">
              BANNER POD
            </text>
            <text x="75" y="47" fill="#FDE047" fontSize="4.5" fontWeight="bold" transform="rotate(-22, 75, 47)">
              lk3mpe / lkempe
            </text>
            <circle cx="60" cy={32 + (frame % 3)} r="2" fill="#38BDF8" />
          </svg>
        </div>
      );

    case 'holo_stage':
      return (
        <div
          onClick={handleClick}
          className={`relative select-none cursor-pointer transition-transform duration-100 ${
            isHovered ? 'scale-105' : ''
          }`}
          style={{ width: 120, height: 130, transform: 'translate(-40px, -85px)' }}
        >
          <svg viewBox="0 0 120 130" width="120" height="130" className="overflow-visible">
            {/* Shadow */}
            <polygon points="15,95 60,75 105,95 60,115" fill="rgba(0,0,0,0.35)" />

            {/* Stage Disc Base */}
            <ellipse cx="60" cy="90" rx="42" ry="18" fill="#4C1D95" stroke="#7C3AED" strokeWidth="1.5" />
            <ellipse cx="60" cy="86" rx="38" ry="15" fill="#581C87" />

            {/* Floating Holographic Projection Rings */}
            <ellipse
              cx="60"
              cy={55 + Math.sin(frame * 0.15) * 3}
              rx="30"
              ry="12"
              fill="none"
              stroke="#C084FC"
              strokeWidth="1.5"
              strokeDasharray="4 2"
              opacity="0.85"
            />
            <ellipse
              cx="60"
              cy={40 + Math.sin(frame * 0.15) * 3}
              rx="20"
              ry="8"
              fill="none"
              stroke="#E879F9"
              strokeWidth="1.2"
              strokeDasharray="3 1"
              opacity="0.9"
            />

            {/* Floating 2035 Vision Marker */}
            <text x="60" y={48 + Math.sin(frame * 0.15) * 3} fill="#FAF5FF" fontSize="5.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              2035 VISION
            </text>
          </svg>
        </div>
      );

    case 'omni_render_rig':
      return (
        <div
          onClick={handleClick}
          className={`relative select-none cursor-pointer transition-transform duration-100 ${
            isHovered ? 'scale-105' : ''
          }`}
          style={{ width: 120, height: 130, transform: 'translate(-40px, -85px)' }}
        >
          <svg viewBox="0 0 120 130" width="120" height="130" className="overflow-visible">
            {/* Shadow */}
            <polygon points="15,95 60,75 105,95 60,115" fill="rgba(0,0,0,0.35)" />

            {/* 3D Rig Base */}
            <polygon points="30,75 60,60 90,75 60,90" fill="#064E3B" stroke="#059669" strokeWidth="1.5" />
            <polygon points="30,75 60,90 60,100 30,85" fill="#022C22" />
            <polygon points="60,90 90,75 90,85 60,100" fill="#047857" />

            {/* Multi-Angle Camera Tower */}
            <line x1="60" y1="60" x2="60" y2="25" stroke="#10B981" strokeWidth="2.5" />
            {/* Camera Head */}
            <rect x="52" y="20" width="16" height="12" rx="2" fill="#065F46" stroke="#34D399" strokeWidth="1.2" />
            <circle cx="60" cy="26" r="3.5" fill="#022C22" stroke="#6EE7B7" strokeWidth="1" />
            <circle cx="60" cy="26" r="1.5" fill={frame % 2 === 0 ? '#EF4444' : '#10B981'} />

            {/* 3D Volumetric Grid Wireframe Emitter */}
            <polygon
              points="40,45 60,35 80,45 60,55"
              fill="none"
              stroke="#6EE7B7"
              strokeWidth="0.8"
              strokeDasharray="2 1"
              opacity="0.8"
            />
            <text x="60" y="80" fill="#A7F3D0" fontSize="4.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              OMNI 3D LAB
            </text>
          </svg>
        </div>
      );

    default:
      return null;
  }
};
