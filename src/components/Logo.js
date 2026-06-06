'use client';
import styled, { useTheme } from 'styled-components';

const SvgIcon = styled.svg`
  width: ${({ $width }) => $width || '65px'};
  height: auto;
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), filter 0.4s ease;
  
  &:hover {
    transform: scale(1.08) translateY(-2px);
    filter: drop-shadow(0 4px 12px ${({ theme }) => theme.colors.accent + '60'});
  }
`;

const Text = styled.text`
  font-family: 'Space Grotesk', 'Outfit', sans-serif;
  font-weight: 800;
  fill: ${({ $useGradient, $color, theme }) => $useGradient ? 'url(#textGradient)' : ($color || theme.colors.text)};
  transition: fill 0.3s ease;
`;

const Brace = styled.path`
  fill: none;
  stroke: ${({ $useGradient, $color, theme }) => $useGradient ? 'url(#braceGradient)' : ($color || theme.colors.text)};
  stroke-width: 24;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: 0.9;
  transition: stroke 0.3s ease, opacity 0.3s ease, transform 0.3s ease;
  
  ${SvgIcon}:hover & {
    opacity: 1;
    stroke: url(#braceGradientHover);
  }
`;

export default function Logo({ width, className, color }) {
    const theme = useTheme();
    // Use gradient if no specific color is provided
    const useGradient = !color;

    return (
        <SvgIcon
            className={className}
            $width={width}
            viewBox="0 0 500 200"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={theme?.colors?.text || '#ffffff'} />
                    <stop offset="100%" stopColor={theme?.colors?.textSecondary || '#e2e8f0'} />
                </linearGradient>
                <linearGradient id="braceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={theme?.colors?.accent || '#0ea5e9'} />
                    <stop offset="100%" stopColor={theme?.colors?.accentLight || '#a855f7'} />
                </linearGradient>
                <linearGradient id="braceGradientHover" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor={theme?.colors?.accent || '#0ea5e9'} />
                    <stop offset="100%" stopColor={theme?.colors?.accentLight || '#a855f7'} />
                </linearGradient>
            </defs>

            {/* Left Brace */}
            <Brace 
                $useGradient={useGradient}
                $color={color}
                style={{ transformOrigin: '120px 100px' }}
                d="M 120 30 C 70 30, 60 50, 60 80 L 60 90 C 60 100, 45 100, 35 100 C 45 100, 60 100, 60 110 L 60 120 C 60 150, 70 170, 120 170" 
            />
            
            {/* AHK Text */}
            <Text
                x="250"
                y="115"
                $useGradient={useGradient}
                $color={color}
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ fontSize: '100px', letterSpacing: '6px' }}
            >
                AHK
            </Text>

            {/* Right Brace */}
            <Brace 
                $useGradient={useGradient}
                $color={color}
                style={{ transformOrigin: '380px 100px' }}
                d="M 380 30 C 430 30, 440 50, 440 80 L 440 90 C 440 100, 455 100, 465 100 C 455 100, 440 100, 440 110 L 440 120 C 440 150, 430 170, 380 170" 
            />
        </SvgIcon>
    );
}
