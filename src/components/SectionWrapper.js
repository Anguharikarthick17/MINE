'use client';
import { useRef, useEffect } from 'react';
import styled from 'styled-components';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SectionContainer = styled.section`
  padding: ${({ theme }) => theme.spacing.section} 0;
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.8s ease, transform 0.8s ease;
  overflow: hidden;

  &.visible {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 0 ${({ theme }) => theme.spacing.md};
  }
`;

const SectionLabel = styled.span`
  display: inline-block;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.accent};
  text-transform: uppercase;
  letter-spacing: 3px;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  position: relative;
  padding-left: 2rem;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    width: 1.2rem;
    height: 2px;
    background: ${({ theme }) => theme.colors.accent};
    transform: translateY(-50%);
  }
`;

const SectionTitle = styled.h2`
  font-size: clamp(2rem, 4vw, 3rem);
  margin-bottom: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.gradientText};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const SectionDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 600px;
  margin-bottom: ${({ theme }) => theme.spacing['3xl']};
`;

export default function SectionWrapper({ children, id, label, title, description, fullWidth = false }) {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        // If already in the viewport when mounted (e.g. page loaded at this section),
        // make it visible immediately without waiting for scroll.
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            el.classList.add('visible');
            return;
        }

        // Use GSAP ScrollTrigger instead of IntersectionObserver so it
        // works correctly alongside ScrollTrigger.normalizeScroll(true)
        // set in page.js. IntersectionObserver does not reliably fire when
        // GSAP intercepts native scroll events.
        const st = ScrollTrigger.create({
            trigger: el,
            start: 'top 92%',
            once: true,
            onEnter: () => el.classList.add('visible'),
        });

        return () => st.kill();
    }, []);

    return (
        <SectionContainer ref={ref} id={id}>
            <Container>
                {label && <SectionLabel>{label}</SectionLabel>}
                {title && <SectionTitle>{title}</SectionTitle>}
                {description && <SectionDescription>{description}</SectionDescription>}
                {!fullWidth && children}
            </Container>
            {fullWidth && children}
        </SectionContainer>
    );
}
