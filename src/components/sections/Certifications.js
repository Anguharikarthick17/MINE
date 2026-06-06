import React, { useRef, useState, useEffect, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { useLanguage } from '@/context/LanguageContext';
import SectionWrapper from '@/components/SectionWrapper';
import { certificationsData } from '@/data/certifications';
import Image from 'next/image';
import { FiChevronLeft, FiChevronRight, FiX, FiZoomIn } from 'react-icons/fi';

const CarouselWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const NavButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: ${({ theme }) => theme.colors.surface || '#fff'};
  border: 1px solid ${({ theme }) => theme.colors.border || '#eaeaea'};
  color: ${({ theme }) => theme.colors.text || '#333'};
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 10;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  transition: all 0.3s ease;
  
  &:hover {
    background: ${({ theme }) => theme.colors.accentLight || '#0EA5E9'};
    color: #fff;
    transform: translateY(-50%) scale(1.1);
  }
  
  &.left {
    left: -24px;
  }
  &.right {
    right: -24px;
  }
  
  @media (max-width: 1250px) {
    &.left { left: 10px; }
    &.right { right: 10px; }
  }
`;

const Grid = styled.div`
  display: flex;
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  overflow-x: auto;
  padding-bottom: 2rem;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    height: 8px;
  }
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.bgSecondary || 'rgba(255, 255, 255, 0.05)'};
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border || 'rgba(255, 255, 255, 0.2)'};
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.accent || 'rgba(255, 255, 255, 0.4)'};
  }
`;

const Card = styled.div`
  flex: 0 0 350px;
  scroll-snap-align: start;
  background: ${({ theme }) => theme.colors.surface || 'rgba(255, 255, 255, 0.03)'};
  border: 1px solid ${({ theme }) => theme.colors.border || 'rgba(255, 255, 255, 0.1)'};
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px ${({ theme }) => theme.colors.accentLight ? `${theme.colors.accentLight}20` : 'rgba(0,0,0,0.2)'};
    border-color: ${({ theme }) => theme.colors.accent || '#0EA5E9'};
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.88); }
  to   { opacity: 1; transform: scale(1); }
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  cursor: zoom-in;
  overflow: hidden;

  &:hover .zoom-hint {
    opacity: 1;
  }
`;

const ZoomHint = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.45);
  opacity: 0;
  transition: opacity 0.25s ease;
  z-index: 2;
  color: #fff;
  font-size: 2rem;
  pointer-events: none;
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 200px;
  position: relative;
  background: ${({ theme }) => theme.colors.bgSecondary || '#111'};
`;

/* ── Lightbox ── */
const LightboxBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  animation: ${fadeIn} 0.2s ease;
`;

const LightboxContent = styled.div`
  position: relative;
  max-width: min(900px, 95vw);
  max-height: 90vh;
  animation: ${scaleIn} 0.25s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const LightboxImage = styled.div`
  position: relative;
  width: min(900px, 95vw);
  height: min(600px, 80vh);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 24px 80px rgba(0,0,0,0.7);
`;

const LightboxTitle = styled.p`
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
  opacity: 0.85;
  margin: 0;
`;

const CloseButton = styled.button`
  position: fixed;
  top: 1.25rem;
  right: 1.25rem;
  z-index: 10000;
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.2);
  color: #fff;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;

  &:hover {
    background: rgba(255,255,255,0.25);
    transform: scale(1.1);
  }
`;

const CardContent = styled.div`
  padding: 1.5rem;
`;

const Title = styled.h3`
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 0.5rem 0;
  font-weight: 600;
`;

const Issuer = styled.p`
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.accent || '#0EA5E9'};
  margin: 0 0 0.25rem 0;
  font-weight: 500;
`;

const DateText = styled.p`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textSecondary || '#aaa'};
  margin: 0 0 1rem 0;
`;

const SkillsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const SkillTag = styled.span`
  background: ${({ theme }) => `${theme.colors.accent}15` || 'rgba(14, 165, 233, 0.15)'};
  color: ${({ theme }) => theme.colors.accent || '#0EA5E9'};
  font-size: 0.75rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-weight: 500;
`;

const CredentialLink = styled.a`
  display: inline-flex;
  align-items: center;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s ease;
  
  &:hover {
    color: ${({ theme }) => theme.colors.accent || '#0EA5E9'};
  }
  
  span {
    margin-left: 0.5rem;
    transition: transform 0.2s ease;
  }
  
  &:hover span {
    transform: translateX(3px);
  }
`;

const Certifications = () => {
  const { t, isRtl } = useLanguage();
  const gridRef = useRef(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [selectedCert, setSelectedCert] = useState(null);

  const openLightbox = useCallback((cert) => {
    setSelectedCert(cert);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeLightbox = useCallback(() => {
    setSelectedCert(null);
    document.body.style.overflow = '';
  }, []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') closeLightbox(); };
    if (selectedCert) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedCert, closeLightbox]);

  const handleMouseDown = (e) => {
    setIsMouseDown(true);
    if (!gridRef.current) return;
    setStartX(e.pageX - gridRef.current.offsetLeft);
    setScrollLeft(gridRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsMouseDown(false);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  const handleMouseMove = (e) => {
    if (!isMouseDown || !gridRef.current) return;
    e.preventDefault();
    const x = e.pageX - gridRef.current.offsetLeft;
    const scroll = (x - startX) * 2; 
    gridRef.current.scrollLeft = scrollLeft - scroll;
  };

  const scrollCarousel = (direction) => {
    if (!gridRef.current) return;
    const scrollAmount = 350 + 32; 
    gridRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
  };

  return (
    <SectionWrapper 
      id="certifications" 
      title={t('certifications.title') || 'My Certifications'}
      description={t('certifications.description') || 'Professional certificates and courses I have completed.'}
    >
      <CarouselWrapper>
        <NavButton className="left" aria-label="Scroll left" onClick={() => scrollCarousel('left')}>
          <FiChevronLeft />
        </NavButton>
        <NavButton className="right" aria-label="Scroll right" onClick={() => scrollCarousel('right')}>
          <FiChevronRight />
        </NavButton>

        <Grid 
          ref={gridRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          style={{ 
            cursor: isMouseDown ? 'grabbing' : 'grab',
            scrollSnapType: isMouseDown ? 'none' : 'x mandatory'
          }}
        >
          {certificationsData.map((cert) => (
            <Card key={cert.id}>
              <ImageWrapper
                role="button"
                aria-label={`View full certificate: ${cert.title}`}
                onClick={() => openLightbox(cert)}
              >
                <ImageContainer>
                  <Image 
                    src={cert.image} 
                    alt={cert.title}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </ImageContainer>
                <ZoomHint className="zoom-hint"><FiZoomIn /></ZoomHint>
              </ImageWrapper>
              <CardContent>
                <Title>{cert.title}</Title>
                <Issuer>{cert.issuer}</Issuer>
                <DateText>{cert.date}</DateText>
                
                {cert.skills && cert.skills.length > 0 && (
                  <SkillsRow>
                    {cert.skills.map(skill => (
                      <SkillTag key={skill}>{skill}</SkillTag>
                    ))}
                  </SkillsRow>
                )}
                
                <CredentialLink 
                  href={cert.credentialUrl} 
                  target="_blank" 
                  rel="noreferrer"
                >
                  {t('certifications.viewCredential') || 'View Credential'} <span style={{ marginLeft: isRtl ? 0 : '0.5rem', marginRight: isRtl ? '0.5rem' : 0 }}>{isRtl ? '←' : '→'}</span>
                </CredentialLink>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </CarouselWrapper>

      {/* Lightbox Modal */}
      {selectedCert && (
        <LightboxBackdrop onClick={closeLightbox}>
          <CloseButton onClick={closeLightbox} aria-label="Close">
            <FiX />
          </CloseButton>
          <LightboxContent onClick={(e) => e.stopPropagation()}>
            <LightboxImage>
              <Image
                src={selectedCert.image}
                alt={selectedCert.title}
                fill
                style={{ objectFit: 'contain' }}
                sizes="(max-width: 900px) 95vw, 900px"
                priority
              />
            </LightboxImage>
            <LightboxTitle>{selectedCert.title} · {selectedCert.issuer}</LightboxTitle>
          </LightboxContent>
        </LightboxBackdrop>
      )}
    </SectionWrapper>
  );
};

export default Certifications;
