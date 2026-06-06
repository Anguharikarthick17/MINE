'use client';
import React, { useRef, useEffect, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useLanguage } from '@/context/LanguageContext';
import SectionWrapper from '@/components/SectionWrapper';
import { achievementsData } from '@/data/achievements';
import { FiChevronLeft, FiChevronRight, FiSkipBack, FiSkipForward, FiX } from 'react-icons/fi';
import gsap from 'gsap';

const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(15px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  opacity: 0;
  visibility: hidden;
`;

const ModalContent = styled.div`
  position: relative;
  width: 100%;
  max-width: 1100px;
  background: ${({ theme }) => theme.colors.glass || 'rgba(15, 15, 20, 0.9)'};
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 32px;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 0;
  box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.8);
  transform: scale(0.9);

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    max-height: 90vh;
    overflow-y: auto;
  }
`;

const ModalImageSection = styled.div`
  position: relative;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const ModalTextSection = styled.div`
  padding: 4rem 3rem;
  display: flex;
  flex-direction: column;

  @media (max-width: 500px) {
    padding: 2rem 1.5rem;
  }
`;

const ModalCloseBtn = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;

  &:hover {
    background: #ff4d4d;
    transform: rotate(90deg);
  }
`;

const Container = styled.div`
  position: relative;
  width: 100%;
  perspective: 1000px;
`;

const Grid = styled.div`
  display: flex;
  gap: 2rem;
  overflow-x: auto;
  padding: 3rem 1rem;
  scroll-behavior: smooth;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
`;

const CardWrapper = styled.div`
  flex: 0 0 clamp(320px, 80vw, 400px);
  height: 480px;
  transform-style: preserve-3d;
  transition: transform 0.1s ease-out;
  cursor: pointer;
`;

const Card = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.colors.glass || 'rgba(10, 10, 15, 0.6)'};
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.05) 0%,
      transparent 50%,
      rgba(255, 255, 255, 0.02) 100%
    );
    z-index: 1;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 200%;
    height: 100%;
    background: linear-gradient(
      to right,
      transparent,
      rgba(255, 255, 255, 0.05),
      transparent
    );
    transform: skewX(-20deg);
    animation: ${shimmer} 3s infinite ease-in-out;
    pointer-events: none;
  }
`;

const CardGlow = styled.div`
  position: absolute;
  inset: -2px;
  background: ${({ $color }) => `linear-gradient(135deg, ${$color}, transparent 60%)`};
  border-radius: 26px;
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: -1;

  ${CardWrapper}:hover & {
    opacity: 0.4;
  }
`;

const Title = styled.h3`
  font-size: 1.75rem;
  font-weight: 800;
  line-height: 1.1;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.5rem;
  z-index: 2;
`;

const Organizer = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ $color }) => $color};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  opacity: 0.9;
  margin-bottom: 2rem;
  z-index: 2;
`;

const RoleBadge = styled.span`
  align-self: flex-start;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 99px;
  font-size: 0.75rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 1.5rem;
  z-index: 2;
`;

const Description = styled.p`
  font-size: 0.95rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textSecondary};
  opacity: 0.8;
  z-index: 2;
`;

const DateText = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono || 'monospace'};
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: auto;
  z-index: 2;
`;

const IconBox = styled.div`
  position: absolute;
  top: 2rem;
  right: 2rem;
  font-size: 2.5rem;
  opacity: 0.2;
  filter: blur(2px);
  transition: all 0.5s ease;
  z-index: 2;

  ${CardWrapper}:hover & {
    opacity: 0.8;
    filter: blur(0px);
    transform: scale(1.2) rotate(10deg);
  }
`;

const NavIcon = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  z-index: 100;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${({ theme }) => theme.colors.accent};
    color: white;
    box-shadow: 0 0 20px ${({ theme }) => theme.colors.accent}44;
  }

  &.prev { left: -25px; }
  &.next { right: -25px; }

  @media (max-width: 1250px) {
    &.prev { left: 10px; }
    &.next { right: 10px; }
  }
`;

const ImagePreview = styled.div`
  width: 100%;
  height: 160px;
  margin-bottom: 1.5rem;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.2);
  z-index: 2;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  &::after {
    content: 'VIEW CERTIFICATE';
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.7rem;
    font-weight: 800;
    letter-spacing: 2px;
    opacity: 0;
    transition: opacity 0.3s ease;
    backdrop-filter: blur(4px);
  }

  ${CardWrapper}:hover & {
    img { transform: scale(1.05); }
    &::after { opacity: 1; }
  }
`;

const AchievementCard = ({ item, onOpen }) => {
  const wrapperRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (centerY - y) / 10;
    const rotateY = (x - centerX) / 10;

    gsap.to(wrapperRef.current, {
      rotateX,
      rotateY,
      duration: 0.5,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    gsap.to(wrapperRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 1,
      ease: 'elastic.out(1, 0.3)',
    });
  };

  return (
    <CardWrapper 
      ref={wrapperRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onOpen(item)}
    >
      <CardGlow $color={item.color} />
      <Card>
        <IconBox>{item.icon}</IconBox>
        <div>
          {item.image && (
            <ImagePreview>
              <img src={item.image} alt={item.title} />
            </ImagePreview>
          )}
          <RoleBadge>{item.role || 'ACHIEVEMENT'}</RoleBadge>
          <Title>{item.title}</Title>
          <Organizer $color={item.color}>{item.context}</Organizer>
          <Description>{item.description}</Description>
        </div>

      </Card>
    </CardWrapper>
  );
};

export default function Achievements() {
  const { t } = useLanguage();
  const gridRef = useRef(null);
  const [selected, setSelected] = useState(null);
  const overlayRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (selected) {
      document.body.style.overflow = 'hidden';
      gsap.to(overlayRef.current, { autoAlpha: 1, duration: 0.4 });
      gsap.to(contentRef.current, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.2)' });
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [selected]);

  const close = () => {
    gsap.to(contentRef.current, { scale: 0.9, opacity: 0, duration: 0.3 });
    gsap.to(overlayRef.current, { autoAlpha: 0, duration: 0.3, onComplete: () => setSelected(null) });
  };

  const scroll = (dir) => {
    if (!gridRef.current) return;
    const amount = 350 + 32;
    gridRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <SectionWrapper 
      id="achievements" 
      label={t('achievements.label')}
      title={t('achievements.title')}
      description={t('achievements.description')}
    >
      <Container>
        <NavIcon className="prev" onClick={() => scroll('left')}><FiChevronLeft /></NavIcon>
        <NavIcon className="next" onClick={() => scroll('right')}><FiChevronRight /></NavIcon>
        <Grid ref={gridRef}>
          {achievementsData.map(item => (
            <AchievementCard key={item.id} item={item} onOpen={setSelected} />
          ))}
        </Grid>
      </Container>

      {/* LIGHTBOX MODAL */}
      <ModalOverlay ref={overlayRef} onClick={close}>
        {selected && (
          <ModalContent ref={contentRef} onClick={e => e.stopPropagation()}>
            <ModalCloseBtn onClick={close}><FiX /></ModalCloseBtn>
            
            <ModalImageSection>
              {selected.image ? (
                <img src={selected.image} alt={selected.title} />
              ) : (
                <div style={{ fontSize: '5rem' }}>{selected.icon}</div>
              )}
            </ModalImageSection>

            <ModalTextSection>
              <RoleBadge>{selected.role}</RoleBadge>
              <Title style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{selected.title}</Title>
              <Organizer $color={selected.color} style={{ fontSize: '1rem', marginBottom: '2.5rem' }}>
                {selected.context}
              </Organizer>
              
              <Description style={{ fontSize: '1.1rem', opacity: 0.9 }}>
                {selected.description}
              </Description>


            </ModalTextSection>
          </ModalContent>
        )}
      </ModalOverlay>
    </SectionWrapper>
  );
}
