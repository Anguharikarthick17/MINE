'use client';
import { useRef } from 'react';
import styled, { keyframes, useTheme } from 'styled-components';
import { useLanguage } from '@/context/LanguageContext';
import Image from 'next/image';
import { FiDownload } from 'react-icons/fi';
import SectionWrapper from '@/components/SectionWrapper';

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(108, 99, 255, 0.3), 0 0 60px rgba(108, 99, 255, 0.1); }
  50% { box-shadow: 0 0 30px rgba(108, 99, 255, 0.6), 0 0 90px rgba(108, 99, 255, 0.3); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const reverseSpin = keyframes`
  from { transform: rotate(360deg); }
  to { transform: rotate(0deg); }
`;

const AboutContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  margin-top: 2rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

const TextColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const BioText = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;

  strong {
    color: ${({ theme }) => theme.colors.text};
    font-weight: 600;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const StatNumber = styled.span`
  font-size: 2.5rem;
  font-weight: 800;
  font-family: ${({ theme }) => theme.fonts.heading};
  color: ${({ theme }) => theme.colors.accent};
  line-height: 1;
`;

const StatLabel = styled.span`
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const PortraitColumn = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
`;

const PortraitWrapper = styled.div`
  position: relative;
  width: 350px;
  height: 350px;
  border-radius: 50%;
  padding: 10px;
  background: ${({ theme }) => theme.colors.gradient};
  animation: ${glow} 3s ease-in-out infinite, ${float} 6s ease-in-out infinite;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 250px;
    height: 250px;
  }

  &::before {
    content: '';
    position: absolute;
    inset: 4px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.bg};
    z-index: 1;
  }
`;

const PortraitInner = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  z-index: 2;
  border: 4px solid transparent;
`;

const OrbitRing = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  margin-top: -${({ $size }) => $size / 2}px;
  margin-left: -${({ $size }) => $size / 2}px;
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: 50%;
  animation: ${spin} ${({ $speed }) => $speed}s linear infinite;
  pointer-events: none;
`;

const OrbitTag = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%);
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 0.5rem 1rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  white-space: nowrap;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  pointer-events: auto;
  
  /* Counter-rotate the tag so the text stays horizontal */
  animation: ${reverseSpin} ${({ $speed }) => $speed}s linear infinite;

  span {
    color: ${({ $color }) => $color};
  }
`;

const DownloadBtn = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  font-weight: 600;
  border-radius: 999px;
  width: fit-content;
  margin-top: 1rem;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.accent};
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(108, 99, 255, 0.15);
  }
`;

export default function About() {
  const { t, language } = useLanguage();
  const theme = useTheme();

  // Name substitution for bio
  const bio1 = (t('about.bio1') || '').replace('{name}', 'ANGU HARI KARTHICK M').replace('{tech}', 'Next.js');
  const bio2 = t('about.bio2');

  return (
    <SectionWrapper
      id="about"
      title={t('about.title') || 'About Me'}
      description={t('about.description') || 'Crafting Digital Experiences'}
    >
      <AboutContainer>
        {/* Left Column: Text */}
        <TextColumn>
          {bio1 && <BioText dangerouslySetInnerHTML={{ __html: bio1 }} />}
          {bio2 && <BioText>{bio2}</BioText>}

          <StatsGrid>
            <StatItem>
              <StatNumber>3+</StatNumber>
              <StatLabel>{t('about.projectsDone')}</StatLabel>
            </StatItem>
          </StatsGrid>

          <DownloadBtn href="/cv.pdf" target="_blank" rel="noreferrer">
            <FiDownload /> {t('about.downloadCv') || 'Download Resume'}
          </DownloadBtn>
        </TextColumn>

        {/* Right Column: Glowing Portrait */}
        <PortraitColumn>
          
          <OrbitRing $size={480} $speed={30}>
            <OrbitTag $speed={30} $color="#fbbf24" style={{ top: '15%', left: '85%' }}>
              <span>⭐</span> Prompt Engineering
            </OrbitTag>
            <OrbitTag $speed={30} $color="#F7DF1E" style={{ top: '85%', left: '15%' }}>
              <span>🌐</span> HTML & CSS
            </OrbitTag>
          </OrbitRing>

          <OrbitRing $size={620} $speed={45} style={{ animationDirection: 'reverse' }}>
            <OrbitTag $speed={45} $color="#a5b4fc" style={{ top: '50%', left: '0%', animationDirection: 'normal' }}>
              <span>♟️</span> Chess Strategy
            </OrbitTag>
            <OrbitTag $speed={45} $color="#3776AB" style={{ top: '50%', left: '100%', animationDirection: 'normal' }}>
              <span>🐍</span> Python / Java
            </OrbitTag>
          </OrbitRing>

          <PortraitWrapper>
            <PortraitInner>
              {/* PLACEHOLDER: The user will replace this file with their photo */}
              <Image 
                src="/profile-photo.jpg" 
                alt="ANGU HARI KARTHICK M Portrait"
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
            </PortraitInner>
          </PortraitWrapper>

        </PortraitColumn>
      </AboutContainer>
    </SectionWrapper>
  );
}
