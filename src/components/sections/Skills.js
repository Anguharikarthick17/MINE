'use client';
import { useRef, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import SectionWrapper from '@/components/SectionWrapper';
import { useLanguage } from '@/context/LanguageContext';
import { skillsData } from '@/data/skills';

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 5px rgba(108, 99, 255, 0.4), 0 0 10px rgba(108, 99, 255, 0.2); }
  50% { box-shadow: 0 0 20px rgba(108, 99, 255, 0.6), 0 0 30px rgba(108, 99, 255, 0.3); }
`;

const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`;

const BentoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  width: 100%;
`;

const SkillCard = styled.div`
  background: ${({ theme }) => theme.colors.glass || 'rgba(255, 255, 255, 0.03)'};
  backdrop-filter: blur(12px);
  border: 1px solid ${({ theme }) => theme.colors.glassBorder || 'rgba(255, 255, 255, 0.1)'};
  border-radius: 24px;
  padding: 2rem;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: ${({ theme }) => theme.colors.gradient || 'linear-gradient(90deg, #6C63FF, #3F3D56)'};
    opacity: 0.5;
  }

  &:hover {
    transform: translateY(-10px);
    border-color: ${({ theme }) => theme.colors.accent || '#6C63FF'};
    background: ${({ theme }) => theme.colors.glassHover || 'rgba(255, 255, 255, 0.05)'};
    box-shadow: 0 20px 40px rgba(0,0,0,0.2);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const CategoryIcon = styled.span`
  font-size: 1.25rem;
`;

const CategoryTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const CategoryDesc = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary || '#A0A0A0'};
  margin-top: -1.25rem;
  margin-bottom: 0.5rem;
  font-weight: 500;
  opacity: 0.8;
`;

const SkillList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SkillItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;

  ${({ $highlight }) => $highlight && css`
    border-color: #6C63FF50;
    background: rgba(108, 99, 255, 0.05);
    animation: ${glow} 3s infinite ease-in-out;
  `}

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    transform: translateX(5px);
  }
`;

const SkillInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const SkillIcon = styled.span`
  font-size: 1.1rem;
`;

const SkillName = styled.span`
  font-size: 0.95rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};

  ${({ $highlight }) => $highlight && `
    color: #a5b4fc;
    text-shadow: 0 0 10px rgba(165, 180, 252, 0.5);
  `}
`;

const SkillMeta = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const SkillLevel = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accent || '#6C63FF'};
  opacity: 0.9;
`;

const SkillDesc = styled.span`
  font-size: 0.7rem;
  color: ${({ theme }) => theme.colors.textSecondary || '#A0A0A0'};
  font-style: italic;
`;

const StarIcon = styled.span`
  color: #fbbf24;
  margin-left: 0.25rem;
  display: inline-block;
  animation: ${pulse} 2s infinite ease-in-out;
`;

export default function Skills() {
  const { t } = useLanguage();

  return (
    <SectionWrapper 
      id="skills" 
      label={t('skills.label')} 
      title={t('skills.title')} 
      description={t('skills.description')}
    >
      <BentoGrid>
        {skillsData.map((category, idx) => (
          <SkillCard key={idx}>
            <CardHeader>
              <CategoryIcon>{category.icon}</CategoryIcon>
              <CategoryTitle>{category.category}</CategoryTitle>
            </CardHeader>
            <CategoryDesc>{category.description}</CategoryDesc>
            
            <SkillList>
              {category.skills.map((skill, sIdx) => (
                <SkillItem key={sIdx} $highlight={skill.highlight}>
                  <SkillInfo>
                    <SkillIcon>{skill.icon}</SkillIcon>
                    <SkillName $highlight={skill.highlight}>
                      {skill.name}
                      {skill.highlight && <StarIcon>⭐</StarIcon>}
                    </SkillName>
                  </SkillInfo>
                  
                  <SkillMeta>
                    {skill.level && <SkillLevel>{skill.level}</SkillLevel>}
                    {skill.description && <SkillDesc>({skill.description})</SkillDesc>}
                  </SkillMeta>
                </SkillItem>
              ))}
            </SkillList>
          </SkillCard>
        ))}
      </BentoGrid>
    </SectionWrapper>
  );
}
