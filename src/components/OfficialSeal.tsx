import React from 'react';

interface OfficialSealProps {
  organization?: string;
  sealType?: string;
  date?: string;
  code?: string;
  size?: number;
}

export const OfficialSeal: React.FC<OfficialSealProps> = ({
  organization = '随州市气象局',
  sealType = '气象业务专用章',
  date = '2026年08月24日',
  code = '421300081920',
  size = 140
}) => {
  return (
    <div 
      className="relative inline-flex items-center justify-center select-none pointer-events-none"
      style={{ width: size, height: size }}
      title="随州市气象局电子公章"
    >
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full text-red-600 opacity-90 drop-shadow-sm transform -rotate-6"
        fill="currentColor"
      >
        {/* Outer and Inner Circle Rings */}
        <circle cx="100" cy="100" r="95" fill="none" stroke="currentColor" strokeWidth="4.5" />
        <circle cx="100" cy="100" r="88" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />

        {/* Circular Path for Upper Organization Text */}
        <defs>
          <path
            id="sealOrgPath"
            d="M 22 100 A 78 78 0 1 1 178 100"
            fill="none"
          />
          <path
            id="sealBottomPath"
            d="M 170 105 A 72 72 0 0 1 30 105"
            fill="none"
          />
        </defs>

        {/* Curved Organization Text */}
        <text
          fill="currentColor"
          fontSize="17.5"
          fontWeight="bold"
          letterSpacing="4"
          className="font-serif tracking-widest"
        >
          <textPath href="#sealOrgPath" startOffset="50%" textAnchor="middle">
            {organization}
          </textPath>
        </text>

        {/* Central Five-Pointed Star */}
        <polygon
          points="100,56 109,79 133,79 114,94 121,117 100,103 79,117 86,94 67,79 91,79"
          fill="currentColor"
        />

        {/* Middle Seal Type Label */}
        <text
          x="100"
          y="138"
          textAnchor="middle"
          fill="currentColor"
          fontSize="15"
          fontWeight="bold"
          letterSpacing="3"
          className="font-serif"
        >
          {sealType}
        </text>

        {/* Verification / Security Code Bottom Ring */}
        <text
          fill="currentColor"
          fontSize="9"
          letterSpacing="1"
          opacity="0.85"
        >
          <textPath href="#sealBottomPath" startOffset="50%" textAnchor="middle">
            防伪码 {code}
          </textPath>
        </text>
      </svg>
    </div>
  );
};
