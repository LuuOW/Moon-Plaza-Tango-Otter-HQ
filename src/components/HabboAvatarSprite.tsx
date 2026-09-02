import React from 'react';
import { AvatarStyle, CharacterAction, Direction } from '../types';

interface HabboAvatarSpriteProps {
  avatar: AvatarStyle;
  direction: Direction;
  action: CharacterAction;
  scale?: number;
  frame?: number;
  isHovered?: boolean;
  className?: string;
}

export const HabboAvatarSprite: React.FC<HabboAvatarSpriteProps> = ({
  avatar,
  direction,
  action,
  scale = 1,
  frame = 0,
  isHovered = false,
  className = '',
}) => {
  // Compute animation offsets
  const isWalking = action === 'walk';
  const isTyping = action === 'type';
  const isCheering = action === 'cheer';
  const hasCoffee = avatar.accessory === 'coffee_cup' || action === 'coffee';

  // Walk bob
  const walkBob = isWalking ? (frame % 2 === 0 ? -2 : 0) : 0;
  const idleBob = !isWalking && action === 'idle' ? Math.sin(frame * 0.8) * 0.8 : 0;
  const typingJitter = isTyping ? (frame % 2 === 0 ? -1 : 1) : 0;
  const cheerJump = isCheering ? -Math.abs(Math.sin(frame * 1.5)) * 4 : 0;

  const totalYOffset = walkBob + idleBob + cheerJump;

  // Render Otter mascot sprite differently if it's Tango!
  if (avatar.isMascot) {
    return (
      <div
        className={`relative inline-block select-none pixelated transition-transform duration-75 ${className}`}
        style={{
          width: 48 * scale,
          height: 64 * scale,
          transform: `translateY(${totalYOffset}px)`,
        }}
      >
        <svg
          viewBox="0 0 48 64"
          width={48 * scale}
          height={64 * scale}
          className="overflow-visible"
        >
          {/* Shadow */}
          <ellipse
            cx="24"
            cy="58"
            rx="14"
            ry="6"
            fill="rgba(0,0,0,0.3)"
          />

          {/* Otter Tail */}
          <path
            d={
              direction === 0 || direction === 1
                ? 'M 14 48 Q 6 52 4 44 Q 8 40 16 46 Z'
                : 'M 32 48 Q 42 52 44 44 Q 40 40 30 46 Z'
            }
            fill="#5A2E0E"
            stroke="#2E1305"
            strokeWidth="1.5"
          />

          {/* Otter Body */}
          <rect
            x="14"
            y="32"
            width="20"
            height="22"
            rx="6"
            fill="#78350F"
            stroke="#451A03"
            strokeWidth="1.5"
          />

          {/* Otter Emerald Vest */}
          <rect
            x="16"
            y="34"
            width="16"
            height="18"
            rx="4"
            fill={avatar.shirtColor}
            stroke="#065F46"
            strokeWidth="1.5"
          />
          {/* Vest gold buttons */}
          <circle cx="24" cy="38" r="1.5" fill="#FBBF24" />
          <circle cx="24" cy="44" r="1.5" fill="#FBBF24" />

          {/* Otter Feet */}
          <rect
            x="14"
            y={52 + (isWalking && frame % 2 === 0 ? -2 : 0)}
            width="8"
            height="6"
            rx="2"
            fill="#451A03"
          />
          <rect
            x="26"
            y={52 + (isWalking && frame % 2 === 1 ? -2 : 0)}
            width="8"
            height="6"
            rx="2"
            fill="#451A03"
          />

          {/* Otter Head */}
          <g transform={`translate(0, ${typingJitter})`}>
            <rect
              x="12"
              y="14"
              width="24"
              height="20"
              rx="8"
              fill="#854D0E"
              stroke="#451A03"
              strokeWidth="1.5"
            />
            {/* Otter Ears */}
            <circle cx="12" cy="16" r="3.5" fill="#5A2E0E" stroke="#2E1305" strokeWidth="1" />
            <circle cx="36" cy="16" r="3.5" fill="#5A2E0E" stroke="#2E1305" strokeWidth="1" />
            <circle cx="12" cy="16" r="1.5" fill="#F5D0A9" />
            <circle cx="36" cy="16" r="1.5" fill="#F5D0A9" />

            {/* Otter Snout & Cheeks */}
            <ellipse cx="24" cy="24" rx="7" ry="5" fill="#FDE68A" />
            <ellipse cx="24" cy="22" rx="2.5" ry="1.8" fill="#18181B" />
            {/* Whiskers */}
            <line x1="16" y1="24" x2="10" y2="23" stroke="#27272A" strokeWidth="1" />
            <line x1="16" y1="26" x2="11" y2="27" stroke="#27272A" strokeWidth="1" />
            <line x1="32" y1="24" x2="38" y2="23" stroke="#27272A" strokeWidth="1" />
            <line x1="32" y1="26" x2="37" y2="27" stroke="#27272A" strokeWidth="1" />

            {/* Eyes */}
            <circle cx="19" cy="19" r="2" fill="#09090B" />
            <circle cx="19.6" cy="18.5" r="0.8" fill="#FFFFFF" />
            <circle cx="29" cy="19" r="2" fill="#09090B" />
            <circle cx="29.6" cy="18.5" r="0.8" fill="#FFFFFF" />

            {/* Otter Cheerful Mouth */}
            <path
              d="M 22 26 Q 24 28 26 26"
              fill="none"
              stroke="#451A03"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </g>

          {/* Otter Paws */}
          {isCheering ? (
            <g>
              <circle cx="10" cy="28" r="4" fill="#5A2E0E" stroke="#2E1305" strokeWidth="1" />
              <circle cx="38" cy="28" r="4" fill="#5A2E0E" stroke="#2E1305" strokeWidth="1" />
            </g>
          ) : isTyping ? (
            <g>
              <circle cx="18" cy={42 + typingJitter} r="3.5" fill="#5A2E0E" />
              <circle cx="30" cy={42 - typingJitter} r="3.5" fill="#5A2E0E" />
            </g>
          ) : (
            <g>
              <circle cx="12" cy="40" r="3.5" fill="#5A2E0E" stroke="#2E1305" strokeWidth="1" />
              <circle cx="36" cy="40" r="3.5" fill="#5A2E0E" stroke="#2E1305" strokeWidth="1" />
            </g>
          )}
        </svg>
      </div>
    );
  }

  // Standard Habbo Pixel Character Sprite
  // Render based on Direction (0: SE, 1: SW, 2: NW, 3: NE)
  const isFacingBack = direction === 2 || direction === 3;
  const isFacingRight = direction === 0 || direction === 3;

  return (
    <div
      className={`relative inline-block select-none pixelated transition-transform duration-75 ${className}`}
      style={{
        width: 48 * scale,
        height: 72 * scale,
        transform: `translateY(${totalYOffset}px) scaleX(${isFacingRight ? 1 : -1})`,
      }}
    >
      <svg
        viewBox="0 0 48 72"
        width={48 * scale}
        height={72 * scale}
        className="overflow-visible"
      >
        {/* Ground Drop Shadow */}
        <ellipse
          cx="24"
          cy="66"
          rx="13"
          ry="5.5"
          fill="rgba(0, 0, 0, 0.35)"
        />

        {/* Legs & Pants */}
        <g>
          {/* Left Leg */}
          <rect
            x="17"
            y={46 + (isWalking && frame % 2 === 0 ? -3 : 0)}
            width="6"
            height="14"
            fill={avatar.pantsColor}
            stroke="#0F172A"
            strokeWidth="1"
            rx="1"
          />
          {/* Left Shoe */}
          <rect
            x="16"
            y={58 + (isWalking && frame % 2 === 0 ? -3 : 0)}
            width="7"
            height="6"
            fill={avatar.shoesColor}
            stroke="#0F172A"
            strokeWidth="1"
            rx="1.5"
          />

          {/* Right Leg */}
          <rect
            x="25"
            y={46 + (isWalking && frame % 2 === 1 ? -3 : 0)}
            width="6"
            height="14"
            fill={avatar.pantsColor}
            stroke="#0F172A"
            strokeWidth="1"
            rx="1"
          />
          {/* Right Shoe */}
          <rect
            x="25"
            y={58 + (isWalking && frame % 2 === 1 ? -3 : 0)}
            width="7"
            height="6"
            fill={avatar.shoesColor}
            stroke="#0F172A"
            strokeWidth="1"
            rx="1.5"
          />
        </g>

        {/* Torso & Shirt */}
        <g>
          {/* Base Torso */}
          <rect
            x="16"
            y="26"
            width="16"
            height="22"
            fill={avatar.shirtColor}
            stroke="#0F172A"
            strokeWidth="1.2"
            rx="2"
          />

          {/* Collar / Tie / Neckline Details */}
          {!isFacingBack && (
            <>
              {avatar.shirtStyle === 'hoodie' && (
                <path
                  d="M 21 26 L 24 32 L 27 26"
                  fill="none"
                  stroke="#1E293B"
                  strokeWidth="1.5"
                />
              )}
              {avatar.shirtStyle === 'suit' && (
                <>
                  {/* White undershirt triangle */}
                  <polygon points="21,26 27,26 24,34" fill="#FFFFFF" />
                  {/* Tie */}
                  <polygon points="23,28 25,28 24.5,36 23.5,36" fill="#DC2626" />
                </>
              )}
              {avatar.shirtStyle === 'turtleneck' && (
                <rect x="20" y="24" width="8" height="4" fill={avatar.shirtColor} stroke="#0F172A" strokeWidth="1" rx="1" />
              )}
              {avatar.shirtStyle === 'billboard_frame' && (
                <g>
                  {/* Digital LED Banner Screen Chest */}
                  <rect x="17" y="28" width="14" height="13" fill="#0C4A6E" stroke="#38BDF8" strokeWidth="1" rx="1" />
                  <rect x="18" y="29" width="12" height="11" fill="#0284C7" opacity="0.8" />
                  <text x="24" y="37" fill="#FFFFFF" fontSize="5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                    {frame % 4 === 0 ? '$$$' : 'TIP'}
                  </text>
                  <circle cx="18.5" cy="30.5" r="0.8" fill={frame % 2 === 0 ? '#4ADE80' : '#22C55E'} />
                </g>
              )}
              {avatar.shirtStyle === 'futuristic_robe' && (
                <g>
                  {/* Neural Energy Circuit Lines */}
                  <path d="M 24 26 L 24 43" stroke="#C084FC" strokeWidth="1.2" strokeDasharray="2 1" />
                  <line x1="20" y1="32" x2="28" y2="32" stroke="#A855F7" strokeWidth="1" />
                  <circle cx="24" cy="35" r="2" fill="#E879F9" />
                </g>
              )}
              {avatar.shirtStyle === 'director_jacket' && (
                <g>
                  {/* Director Camera Harness */}
                  <path d="M 18 26 L 30 44" stroke="#064E3B" strokeWidth="1.5" />
                  <path d="M 30 26 L 18 44" stroke="#064E3B" strokeWidth="1.5" />
                  <rect x="21" y="32" width="6" height="5" rx="1" fill="#022C22" stroke="#34D399" strokeWidth="0.8" />
                  <circle cx="24" cy="34.5" r="1.5" fill="#10B981" />
                </g>
              )}
            </>
          )}

          {/* Belt */}
          <rect
            x="16"
            y="44"
            width="16"
            height="3"
            fill="#0F172A"
          />
          {!isFacingBack && (
            <rect x="22" y="44" width="4" height="3" fill="#F59E0B" />
          )}
        </g>

        {/* Arms */}
        {isCheering ? (
          <g>
            {/* Raised left arm */}
            <rect x="10" y="16" width="5" height="16" rx="2" fill={avatar.shirtColor} stroke="#0F172A" strokeWidth="1" />
            <circle cx="12.5" cy="15" r="3" fill={avatar.skinColor} stroke="#0F172A" strokeWidth="1" />

            {/* Raised right arm */}
            <rect x="33" y="16" width="5" height="16" rx="2" fill={avatar.shirtColor} stroke="#0F172A" strokeWidth="1" />
            <circle cx="35.5" cy="15" r="3" fill={avatar.skinColor} stroke="#0F172A" strokeWidth="1" />
          </g>
        ) : isTyping ? (
          <g transform={`translate(0, ${typingJitter})`}>
            {/* Arms extending forward */}
            <rect x="12" y="32" width="6" height="12" rx="2" fill={avatar.shirtColor} stroke="#0F172A" strokeWidth="1" />
            <circle cx="15" cy="44" r="2.5" fill={avatar.skinColor} />

            <rect x="30" y="32" width="6" height="12" rx="2" fill={avatar.shirtColor} stroke="#0F172A" strokeWidth="1" />
            <circle cx="33" cy="44" r="2.5" fill={avatar.skinColor} />
          </g>
        ) : (
          <g>
            {/* Left arm */}
            <rect x="12" y="28" width="5" height="14" rx="2" fill={avatar.shirtColor} stroke="#0F172A" strokeWidth="1" />
            <circle cx="14.5" cy="42" r="2.5" fill={avatar.skinColor} />

            {/* Right arm */}
            <rect x="31" y="28" width="5" height="14" rx="2" fill={avatar.shirtColor} stroke="#0F172A" strokeWidth="1" />
            <circle cx="33.5" cy="42" r="2.5" fill={avatar.skinColor} />

            {/* Coffee cup accessory in hand */}
            {hasCoffee && (
              <g transform="translate(32, 38)">
                <rect x="0" y="0" width="6" height="7" rx="1" fill="#FFFFFF" stroke="#0F172A" strokeWidth="0.8" />
                <rect x="0" y="2" width="6" height="3" fill="#D97706" />
                {/* Steam */}
                <path d="M 2 -2 Q 3 -4 2 -6" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8" />
              </g>
            )}
          </g>
        )}

        {/* Head and Face */}
        <g>
          {/* Neck */}
          <rect x="21" y="22" width="6" height="5" fill={avatar.skinColor} />

          {/* Head Base */}
          <rect
            x="14"
            y="8"
            width="20"
            height="18"
            rx="4"
            fill={avatar.skinColor}
            stroke="#0F172A"
            strokeWidth="1.2"
          />

          {/* Facial Features (if facing forward) */}
          {!isFacingBack && (
            <g>
              {/* Eyes */}
              <rect x="19" y="14" width="2.5" height="3" fill="#0F172A" rx="0.5" />
              <rect x="19.5" y="14" width="1" height="1" fill="#FFFFFF" />

              <rect x="27" y="14" width="2.5" height="3" fill="#0F172A" rx="0.5" />
              <rect x="27.5" y="14" width="1" height="1" fill="#FFFFFF" />

              {/* Eyebrows */}
              <line x1="18" y1="12" x2="22" y2="12" stroke="#4B5563" strokeWidth="1" />
              <line x1="26" y1="12" x2="30" y2="12" stroke="#4B5563" strokeWidth="1" />

              {/* Smile / Mouth */}
              {action === 'talk' ? (
                <rect x="22" y="20" width="4" height="2" fill="#BE123C" rx="1" />
              ) : (
                <line x1="22" y1="21" x2="26" y2="21" stroke="#9A3412" strokeWidth="1" strokeLinecap="round" />
              )}

              {/* Glasses Accessory */}
              {avatar.accessory === 'glasses' && (
                <g>
                  <rect x="17" y="13" width="6" height="5" fill="none" stroke="#1E293B" strokeWidth="1.2" rx="1" />
                  <rect x="25" y="13" width="6" height="5" fill="none" stroke="#1E293B" strokeWidth="1.2" rx="1" />
                  <line x1="23" y1="15" x2="25" y2="15" stroke="#1E293B" strokeWidth="1.2" />
                </g>
              )}
            </g>
          )}

          {/* Hair Styles */}
          {avatar.hairStyle === 'pompadour' && (
            <g>
              <rect x="13" y="4" width="22" height="7" rx="3" fill={avatar.hairColor} stroke="#0F172A" strokeWidth="1" />
              <rect x="12" y="7" width="5" height="10" rx="2" fill={avatar.hairColor} />
              <rect x="31" y="7" width="5" height="10" rx="2" fill={avatar.hairColor} />
            </g>
          )}
          {avatar.hairStyle === 'messy' && (
            <g>
              <path
                d="M 12 10 Q 18 3 24 5 Q 30 3 36 10 L 35 14 L 13 14 Z"
                fill={avatar.hairColor}
                stroke="#0F172A"
                strokeWidth="1"
              />
              <circle cx="16" cy="6" r="3" fill={avatar.hairColor} />
              <circle cx="28" cy="5" r="3.5" fill={avatar.hairColor} />
              <circle cx="22" cy="4" r="3" fill={avatar.hairColor} />
            </g>
          )}
          {avatar.hairStyle === 'curly' && (
            <g>
              <circle cx="15" cy="7" r="4" fill={avatar.hairColor} stroke="#0F172A" strokeWidth="0.8" />
              <circle cx="22" cy="5" r="4.5" fill={avatar.hairColor} stroke="#0F172A" strokeWidth="0.8" />
              <circle cx="29" cy="6" r="4" fill={avatar.hairColor} stroke="#0F172A" strokeWidth="0.8" />
              <circle cx="34" cy="11" r="4" fill={avatar.hairColor} stroke="#0F172A" strokeWidth="0.8" />
              <circle cx="13" cy="11" r="4" fill={avatar.hairColor} stroke="#0F172A" strokeWidth="0.8" />
            </g>
          )}
          {avatar.hairStyle === 'short' && (
            <g>
              <rect x="13" y="6" width="22" height="6" rx="2" fill={avatar.hairColor} stroke="#0F172A" strokeWidth="1" />
              <rect x="12" y="8" width="4" height="6" fill={avatar.hairColor} />
              <rect x="32" y="8" width="4" height="6" fill={avatar.hairColor} />
            </g>
          )}
          {avatar.hairStyle === 'slick' && (
            <g>
              <path
                d="M 13 9 Q 24 5 35 9 L 34 14 L 14 14 Z"
                fill={avatar.hairColor}
                stroke="#0F172A"
                strokeWidth="1"
              />
            </g>
          )}
          {avatar.hairStyle === 'hologram_crest' && (
            <g>
              {/* Cyan Hologram Crest with cyber pulses */}
              <polygon
                points="14,8 24,1 34,8 24,5"
                fill="#38BDF8"
                stroke="#0284C7"
                strokeWidth="1"
                opacity={0.9}
              />
              <circle cx="24" cy="3" r="1.5" fill="#E0F2FE" />
              <line x1="18" y1="6" x2="30" y2="6" stroke="#BAE6FD" strokeWidth="0.8" strokeDasharray="1 1" />
            </g>
          )}
          {avatar.hairStyle === 'neural_halo' && (
            <g>
              {/* Floating Neural Energy Halo */}
              <ellipse
                cx="24"
                cy="3"
                rx="14"
                ry="4"
                fill="none"
                stroke="#C084FC"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />
              <circle cx="24" cy={1 + Math.sin(frame * 0.2) * 1.5} r="1.8" fill="#F472B6" />
            </g>
          )}

          {/* Headset Accessory */}
          {avatar.accessory === 'headset' && (
            <g>
              <path d="M 12 14 C 12 5 36 5 36 14" fill="none" stroke="#475569" strokeWidth="2" />
              <rect x="11" y="12" width="3" height="6" rx="1" fill="#0EA5E9" />
              <rect x="34" y="12" width="3" height="6" rx="1" fill="#0EA5E9" />
              {!isFacingBack && (
                <path d="M 35 16 L 31 22 L 27 22" fill="none" stroke="#0EA5E9" strokeWidth="1.2" />
              )}
            </g>
          )}

          {/* Neon Visor Accessory (Aether / LinkedIn Visionary) */}
          {avatar.accessory === 'neon_visor' && !isFacingBack && (
            <g>
              <rect x="15" y="12" width="18" height="5" rx="1.5" fill="#4C1D95" stroke="#A855F7" strokeWidth="1" />
              <line x1="17" y1="14.5" x2="31" y2="14.5" stroke="#E879F9" strokeWidth="1.5" />
              <circle cx="24" cy="14.5" r="1" fill="#FFFFFF" />
            </g>
          )}

          {/* 3D Camera Lens Rig Accessory (Nova / 3D Shorts Director) */}
          {avatar.accessory === 'camera_lens' && (
            <g>
              {/* Shoulder-mounted 3D spatial lens */}
              <rect x="33" y="14" width="8" height="7" rx="1.5" fill="#064E3B" stroke="#10B981" strokeWidth="1" />
              <circle cx="37" cy="17.5" r="2.5" fill="#022C22" stroke="#34D399" strokeWidth="0.8" />
              <circle cx="37" cy="17.5" r="1" fill="#4ADE80" />
            </g>
          )}

          {/* Hologram Display HUD (Banner Sentinel) */}
          {avatar.accessory === 'hologram_display' && (
            <g transform="translate(0, -6)">
              {/* Floating Holographic Ad Pod Badge */}
              <rect x="13" y="0" width="22" height="6" rx="1.5" fill="#0369A1" opacity="0.85" stroke="#38BDF8" strokeWidth="0.8" />
              <text x="24" y="4.5" fill="#F0F9FF" fontSize="3.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                +4.8% ROI
              </text>
            </g>
          )}
        </g>
      </svg>
    </div>
  );
};
