'use client';
import { useRef, useEffect, useState, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { FiPlay, FiX, FiMaximize2 } from 'react-icons/fi';
import SectionWrapper from '@/components/SectionWrapper';

/* ═══════════════════════════════════════
   KEYFRAMES
═══════════════════════════════════════ */
const glowPulse = keyframes`
  0%, 100% { box-shadow: inset 0 0 30px rgba(52,211,153,0.15), inset 0 0 60px rgba(56,189,248,0.08); }
  50%       { box-shadow: inset 0 0 50px rgba(52,211,153,0.35), inset 0 0 100px rgba(56,189,248,0.18); }
`;

const borderFlow = keyframes`
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const scanline = keyframes`
  0%   { transform: translateY(-100%); }
  100% { transform: translateY(200%); }
`;

const backdropIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const modalIn = keyframes`
  from { opacity: 0; transform: scale(0.88) translateY(30px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
`;

/* ═══════════════════════════════════════
   GRID
═══════════════════════════════════════ */
const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;

  @media (max-width: 1100px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 700px)  { grid-template-columns: 1fr; }
`;

/* ═══════════════════════════════════════
   CARD
═══════════════════════════════════════ */
const Card = styled.article`
  position: relative;
  background: ${({ theme }) =>
    theme.name === 'dark'
      ? 'linear-gradient(145deg, rgba(22,22,58,0.9) 0%, rgba(10,10,26,0.95) 100%)'
      : 'linear-gradient(145deg, rgba(255,255,255,0.92) 0%, rgba(240,240,243,0.95) 100%)'};
  border: 1px solid ${({ theme }) => theme.colors.glassBorder};
  border-radius: 20px;
  overflow: hidden;
  backdrop-filter: blur(20px);
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
              box-shadow 0.4s ease,
              border-color 0.4s ease;
  opacity: 0;
  transform: translateY(40px);

  ${({ $visible, $delay }) =>
    $visible &&
    css`animation: ${fadeUp} 0.7s ease ${$delay}s forwards;`}

  &:hover {
    transform: translateY(-8px) scale(1.01);
    border-color: rgba(52, 211, 153, 0.5);
    box-shadow: 0 20px 60px rgba(0,0,0,0.4),
                0 0 40px rgba(52,211,153,0.12),
                0 0 80px rgba(56,189,248,0.08);
  }

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 20px;
    padding: 1.5px;
    background: linear-gradient(90deg, #34d399, #38bdf8, #818cf8, #34d399);
    background-size: 300% 300%;
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.4s ease;
    animation: ${borderFlow} 4s ease infinite;
    pointer-events: none;
  }

  &:hover::before { opacity: 1; }
`;

/* ═══════════════════════════════════════
   VIDEO WRAPPER (card thumbnail)
═══════════════════════════════════════ */
const VideoWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: ${({ theme }) => theme.name === 'dark' ? '#090918' : '#dde1f0'};
  cursor: pointer;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, transparent 0%, rgba(52,211,153,0.04) 50%, transparent 100%);
    width: 100%;
    height: 50%;
    animation: ${scanline} 6s linear infinite;
    pointer-events: none;
    z-index: 2;
  }
`;

const StyledVideo = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
  display: block;
  transition: transform 0.5s ease;
  pointer-events: none;

  ${Card}:hover & { transform: scale(1.06); }
`;

const VideoGlow = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 3;
  transition: all 0.4s ease;

  ${Card}:hover & { animation: ${glowPulse} 2s ease-in-out infinite; }
`;

/* Dark overlay on hover to show the play button clearly */
const HoverOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0);
  transition: background 0.3s ease;
  z-index: 4;
  display: flex;
  align-items: center;
  justify-content: center;

  ${Card}:hover & {
    background: rgba(0, 0, 0, 0.45);
  }
`;

const PlayButton = styled.button`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(10, 10, 26, 0.7);
  border: 2px solid rgba(52, 211, 153, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #34d399;
  font-size: 1.5rem;
  cursor: pointer;
  backdrop-filter: blur(8px);
  box-shadow: 0 0 25px rgba(52, 211, 153, 0.5);
  opacity: 0;
  transform: scale(0.8);
  transition: opacity 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
  pointer-events: none;

  ${Card}:hover & {
    opacity: 1;
    transform: scale(1);
    pointer-events: auto;
  }

  &:hover {
    background: rgba(52, 211, 153, 0.2);
    box-shadow: 0 0 40px rgba(52, 211, 153, 0.7);
    transform: scale(1.1) !important;
  }
`;

const CategoryBadge = styled.span`
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  z-index: 5;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  background: linear-gradient(135deg, rgba(52,211,153,0.2), rgba(56,189,248,0.2));
  border: 1px solid rgba(52, 211, 153, 0.4);
  color: #34d399;
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  backdrop-filter: blur(10px);
`;

/* ═══════════════════════════════════════
   CARD BODY
═══════════════════════════════════════ */
const CardBody = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CardTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 800;
  margin: 0;
  background: ${({ theme }) => theme.colors.gradientText};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const CardDesc = styled.p`
  font-size: 0.9rem;
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const TechRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const TechBadge = styled.span`
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  padding: 0.3rem 0.8rem;
  border-radius: 999px;
  background: ${({ theme }) =>
    theme.name === 'dark' ? 'rgba(56,189,248,0.1)' : 'rgba(14,165,233,0.1)'};
  border: 1px solid ${({ theme }) =>
    theme.name === 'dark' ? 'rgba(56,189,248,0.25)' : 'rgba(14,165,233,0.3)'};
  color: ${({ theme }) => theme.name === 'dark' ? '#38bdf8' : '#0ea5e9'};
  transition: all 0.25s ease;

  &:hover {
    background: rgba(56,189,248,0.2);
    border-color: rgba(56,189,248,0.5);
    box-shadow: 0 0 10px rgba(56,189,248,0.3);
  }
`;

const ActionsRow = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-top: 0.25rem;
`;

const WatchBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.6rem 1.4rem;
  border-radius: 10px;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  cursor: pointer;
  border: none;
  color: #fff;
  background: linear-gradient(135deg, #34d399 0%, #38bdf8 100%);
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, #6ee7b7, #7dd3fc);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(52,211,153,0.45), 0 0 20px rgba(56,189,248,0.3);
    &::after { opacity: 1; }
  }

  svg, span { position: relative; z-index: 1; }
`;

/* ═══════════════════════════════════════
   VIDEO MODAL
═══════════════════════════════════════ */
const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  animation: ${backdropIn} 0.25s ease;
  backdrop-filter: blur(8px);
`;

const ModalBox = styled.div`
  position: relative;
  width: min(900px, 96vw);
  border-radius: 18px;
  overflow: hidden;
  animation: ${modalIn} 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 0 80px rgba(52,211,153,0.25), 0 30px 80px rgba(0,0,0,0.7);
  border: 1px solid rgba(52, 211, 153, 0.3);
`;

const ModalVideo = styled.iframe`
  width: 100%;
  aspect-ratio: 16 / 9;
  border: none;
  display: block;
  max-height: 85vh;
  background: #000;
`;

const ModalHeader = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.9rem 1.2rem;
  background: linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, transparent 100%);
`;

const ModalTitle = styled.span`
  color: #fff;
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-shadow: 0 2px 8px rgba(0,0,0,0.8);
`;

const CloseBtn = styled.button`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.3);
  background: rgba(255,255,255,0.1);
  color: #fff;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(6px);
  transition: background 0.2s ease, transform 0.2s ease;

  &:hover {
    background: rgba(239,68,68,0.7);
    transform: scale(1.1);
  }
`;

/* ═══════════════════════════════════════
   DATA
═══════════════════════════════════════ */
const PROJECTS = [
  {
    id: 'agrismart',
    title: 'AgriSmart',
    category: 'Smart Agriculture Platform',
    description:
      'AgriSmart is an intelligent agriculture solution designed to help farmers make better decisions using technology. The platform focuses on improving productivity, monitoring agricultural activities, and supporting data-driven farming practices.',
    youtubeId: 'ea9nXJXycBw',
    tech: ['Next.js', 'React', 'AI/ML', 'Node.js', 'MongoDB', 'IoT'],
  },
  {
    id: 'smartcity',
    title: 'Smart City',
    category: 'Smart Urban Management System',
    description:
      'Smart City is a modern platform designed to improve urban living through technology. It focuses on city management, resource optimization, digital services, and efficient communication between citizens and authorities.',
    youtubeId: 'hfe-vw1lqaY',
    tech: ['React', 'TypeScript', 'REST API', 'PostgreSQL', 'Redis', 'Docker'],
  },
  {
    id: 'roadsafety',
    title: 'Road Safety',
    category: 'Road Safety Awareness Platform',
    description:
      'Road Safety is a web-based solution focused on promoting safe driving practices, traffic awareness, and accident prevention through educational resources and interactive features.',
    youtubeId: 'YQria_F7FlU',
    tech: ['HTML5', 'CSS3', 'JavaScript', 'Python', 'Flask', 'Chart.js'],
  },
];

/* ═══════════════════════════════════════
   VIDEO MODAL COMPONENT
═══════════════════════════════════════ */
function VideoModal({ project, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <ModalBackdrop onClick={onClose}>
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{project.title} — {project.category}</ModalTitle>
          <CloseBtn onClick={onClose} aria-label="Close video">
            <FiX />
          </CloseBtn>
        </ModalHeader>
        <ModalVideo
          src={`https://www.youtube.com/embed/${project.youtubeId}?autoplay=1&controls=1&rel=0`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          title={`${project.title} Video Demo`}
        />
      </ModalBox>
    </ModalBackdrop>
  );
}

/* ═══════════════════════════════════════
   PROJECT CARD
═══════════════════════════════════════ */
function ProjectCard({ project, delay, visible, onWatch }) {
  return (
    <Card $visible={visible} $delay={delay}>
      {/* Thumbnail video — clicking anywhere opens fullscreen modal */}
      <VideoWrapper onClick={() => onWatch(project)}>
        <CategoryBadge>{project.category}</CategoryBadge>
        <StyledVideo
          src={`https://www.youtube.com/embed/${project.youtubeId}?autoplay=1&mute=1&loop=1&playlist=${project.youtubeId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&playsinline=1`}
          allow="autoplay; encrypted-media"
          title={`${project.title} Preview`}
        />
        <VideoGlow />
        <HoverOverlay>
          <PlayButton
            aria-label={`Watch ${project.title} demo`}
            onClick={(e) => { e.stopPropagation(); onWatch(project); }}
          >
            <FiPlay />
          </PlayButton>
        </HoverOverlay>
      </VideoWrapper>

      {/* Card body */}
      <CardBody>
        <CardTitle>{project.title}</CardTitle>
        <CardDesc>{project.description}</CardDesc>

        <TechRow>
          {project.tech.map((t) => (
            <TechBadge key={t}>{t}</TechBadge>
          ))}
        </TechRow>

        <ActionsRow>
          <WatchBtn onClick={() => onWatch(project)}>
            <FiMaximize2 />
            <span>Watch Demo</span>
          </WatchBtn>
        </ActionsRow>
      </CardBody>
    </Card>
  );
}

/* ═══════════════════════════════════════
   SECTION
═══════════════════════════════════════ */
export default function MyProjects() {
  const [visible, setVisible] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
      },
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleWatch = useCallback((project) => {
    setActiveProject(project);
  }, []);

  const handleClose = useCallback(() => {
    setActiveProject(null);
  }, []);

  return (
    <div ref={sectionRef}>
      <SectionWrapper
        id="my-projects"
        label="Portfolio"
        title="My Projects"
        description="Real-world projects that showcase my skills in web development, AI integration, and problem solving."
      >
        <ProjectsGrid>
          {PROJECTS.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              delay={i * 0.15}
              visible={visible}
              onWatch={handleWatch}
            />
          ))}
        </ProjectsGrid>
      </SectionWrapper>

      {/* Fullscreen video modal */}
      {activeProject && (
        <VideoModal project={activeProject} onClose={handleClose} />
      )}
    </div>
  );
}
