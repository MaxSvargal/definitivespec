'use client';

import React, { useRef, useEffect, useState, useMemo } from 'react';
import {
  ListChecks,
  CodeSimple,
  ShieldCheck,
  TreeStructure,
  SelectionAll,
  PlugsConnected,
  Graph,
  Repeat,
  Broadcast,
  Scales,
  Gauge,
  Database,
  BookOpen,
  Robot,
  TrendUp
} from 'phosphor-react';
import { 
  type ArtifactPosition,
  type Particle,
  type EnergyBolt,
  type AnimatedConnection,
  type VisualizationSceneConfig,
  useSceneEffects,
  useCodeTransformation
} from '../hooks';

// Constants
const ARTIFACT_ICONS = {
  requirement: <ListChecks size={24} weight="duotone" />,
  code: <CodeSimple size={24} weight="duotone" />,
  test: <ShieldCheck size={24} weight="thin" />,
  model: <TreeStructure size={24} weight="thin" />,
  design: <SelectionAll size={24} weight="thin" />,
  api: <PlugsConnected size={24} weight="thin" />,
  interaction: <Graph size={24} weight="thin" />,
  behavior: <Repeat size={24} weight="thin" />,
  event: <Broadcast size={24} weight="thin" />,
  policy: <Scales size={24} weight="thin" />,
  nfr: <Gauge size={24} weight="thin" />,
  infra: <Database size={24} weight="thin" />,
  glossary: <BookOpen size={24} weight="thin" />,
  directive: <Robot size={24} weight="thin" />,
  kpi: <TrendUp size={24} weight="thin" />
} as const;

const RINGS = {
  inner: {
    label: 'Feature Logic',
    artifacts: ['requirement', 'code', 'test', 'model'],
    radius: 140,
    color: 'rgba(0, 229, 153, 0.8)'
  },
  middle: {
    label: 'System Architecture', 
    artifacts: ['design', 'api', 'interaction', 'behavior', 'event'],
    radius: 260,
    color: 'rgba(0, 184, 255, 0.8)'
  },
  outer: {
    label: 'Governance & Rules',
    artifacts: ['policy', 'nfr', 'infra', 'glossary', 'kpi', 'directive'],
    radius: 380,
    color: 'rgba(168, 85, 247, 0.8)'
  }
} as const;

// Scene configurations
const SCENE_CONFIGS: Record<number, VisualizationSceneConfig> = {
  0: {
    highlightedArtifacts: [],
    zoomLevel: 1,
    panOffset: { x: 0, y: 0 },
    showDirectiveEffect: false,
    codeTransformed: false
  },
  1: {
    highlightedArtifacts: ['requirement', 'code', 'test', 'model'],
    zoomLevel: 1.3,
    panOffset: { x: 0, y: 30 },
    showDirectiveEffect: false,
    codeTransformed: false,
    connections: [
      { from: 'requirement', to: 'code', type: 'drives', delay: 300 },
      { from: 'requirement', to: 'test', type: 'drives', delay: 500 },
      { from: 'model', to: 'code', type: 'data', delay: 700 },
      { from: 'test', to: 'code', type: 'verify', delay: 900 },
      { from: 'test', to: 'requirement', type: 'verify', delay: 1100 }
    ],
    particles: [
      { artifactTypes: ['requirement', 'code', 'test', 'model'], count: 3, color: '#00E599', delay: 500 }
    ]
  },
  2: {
    highlightedArtifacts: ['design', 'api', 'interaction', 'behavior', 'event'],
    zoomLevel: 1.1,
    panOffset: { x: 0, y: 0 },
    showDirectiveEffect: false,
    codeTransformed: false,
    connections: [
      { from: 'design', to: 'api', type: 'expose', delay: 300 },
      { from: 'interaction', to: 'design', type: 'sequence', delay: 600 },
      { from: 'behavior', to: 'design', type: 'state', delay: 900 },
      { from: 'event', to: 'design', type: 'broadcast', delay: 1200 },
      { from: 'event', to: 'api', type: 'broadcast', delay: 1350 },
      { from: 'event', to: 'interaction', type: 'broadcast', delay: 1500 },
      { from: 'event', to: 'behavior', type: 'broadcast', delay: 1650 }
    ]
  },
  3: {
    highlightedArtifacts: ['policy', 'nfr', 'infra', 'glossary', 'directive', 'code'],
    zoomLevel: 0.9,
    panOffset: { x: 0, y: -15 },
    showDirectiveEffect: true,
    codeTransformed: false,
    connections: [
      { from: 'policy', to:'code', type: 'govern', delay: 200 },
      { from: 'nfr', to: 'code', type: 'govern', delay: 400 },
      { from: 'infra', to: 'code', type: 'support', delay: 600 },
      { from: 'glossary', to: 'code', type: 'define', delay: 800 },
      { from: 'directive', to: 'code', type: 'transform', delay: 1000 }
    ],
    specialEffects: [
      { type: 'codeTransform', delay: 1550 }
    ]
  },
  4: {
    highlightedArtifacts: ['kpi', 'interaction', 'api', 'requirement'],
    zoomLevel: 0.8,
    panOffset: { x: 0, y: -10 },
    showDirectiveEffect: false,
    codeTransformed: false,
    connections: [
      { from: 'kpi', to: 'interaction', type: 'measure', delay: 300 },
      { from: 'kpi', to: 'api', type: 'measure', delay: 500 },
      { from: 'requirement', to: 'kpi', type: 'whatif', delay: 1200 }
    ],
    specialEffects: [
      { type: 'kpiSpark', delay: 700 },
      { type: 'whatifSpark', delay: 1000 }
    ],
    particles: [
      { artifactTypes: ['kpi'], count: 5, color: '#fbbf24', delay: 800 }
    ]
  }
};

// Utility functions
export const getArtifactPositions = (): ArtifactPosition[] => {
  const positions: ArtifactPosition[] = [];
  const centerX = 450;
  const centerY = 350;

  Object.entries(RINGS).forEach(([ringKey, ring]) => {
    const artifactCount = ring.artifacts.length;
    ring.artifacts.forEach((artifact, index) => {
      const angle = (index / artifactCount) * 2 * Math.PI - Math.PI / 2;
      const x = centerX + Math.cos(angle) * ring.radius;
      const y = centerY + Math.sin(angle) * ring.radius;
      
      positions.push({
        x,
        y,
        angle,
        ring: ringKey,
        type: artifact
      });
    });
  });

  return positions;
};

const createParticles = (x: number, y: number, count: number, color: string): Particle[] => {
  const newParticles: Particle[] = [];
  const timestamp = Date.now();
  
  for (let i = 0; i < count; i++) {
    const uniqueId = `${timestamp}-${Math.random().toString(36).substr(2, 9)}-${i}`;
    newParticles.push({
      id: uniqueId,
      x: x + (Math.random() - 0.5) * 15,
      y: y + (Math.random() - 0.5) * 15,
      vx: (Math.random() - 0.5) * 3,
      vy: (Math.random() - 0.5) * 3,
      life: 45,
      maxLife: 45,
      color
    });
  }
  
  return newParticles;
};

const createAnimatedConnection = (from: string, to: string, type?: string): AnimatedConnection => ({
  id: `conn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  from,
  to,
  type,
  progress: 0
});

const getSceneConfig = (sceneId: number): VisualizationSceneConfig => {
  const config = SCENE_CONFIGS[sceneId];
  if (!config) {
    return SCENE_CONFIGS[0] as VisualizationSceneConfig;
  }
  return config as VisualizationSceneConfig;
};

// Custom hooks
const useScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentScene, setCurrentScene] = useState(0);

  useEffect(() => {
      const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight - 2000;
      
      const progress = Math.min(scrollTop / documentHeight, 1);
      setScrollProgress(progress);
      let newScene: number;
      if (progress < 0.12) {
          newScene = 0;
      } else if (progress < 0.36) {
          newScene = 1;
      } else if (progress < 0.60) {
          newScene = 2;
      } else if (progress < 0.80) {
          newScene = 3;
      } else {
          newScene = 4;
      }

      setCurrentScene(prevScene => newScene !== prevScene ? newScene : prevScene);
      };

      window.addEventListener('scroll', handleScroll);
      handleScroll();
      
      return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { scrollProgress, currentScene };
};

const useAnimationSystem = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [energyBolts, setEnergyBolts] = useState<EnergyBolt[]>([]);
  const [animatedConnections, setAnimatedConnections] = useState<AnimatedConnection[]>([]);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const animate = () => {
      setParticles(prev => prev
        .map(particle => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          life: particle.life - 1,
          vx: particle.vx * 0.98,
          vy: particle.vy * 0.98
        }))
        .filter(particle => particle.life > 0)
      );

      setEnergyBolts(prev => prev
        .map(bolt => ({
          ...bolt,
          progress: Math.min(bolt.progress + 0.08, 1)
        }))
        .filter(bolt => bolt.progress < 1)
      );

      setAnimatedConnections(prev => prev
        .map(conn => ({
          ...conn,
          progress: Math.min(conn.progress + 0.03, 1)
        }))
      );

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return {
    particles,
    energyBolts,
    animatedConnections,
    setParticles,
    setEnergyBolts,
    setAnimatedConnections
  };
};

const useSceneManager = (currentScene: number) => {
  const [highlightedArtifacts, setHighlightedArtifacts] = useState<string[]>([]);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [showDirectiveEffect, setShowDirectiveEffect] = useState(false);
  const [codeTransformed, setCodeTransformed] = useState(false);
  
  const artifactPositions = useMemo(() => getArtifactPositions(), []);
  const config = useMemo(() => getSceneConfig(currentScene), [currentScene]);

  const {
    particles,
    energyBolts,
    animatedConnections,
    setParticles,
    setEnergyBolts,
    setAnimatedConnections
  } = useAnimationSystem();

  // Use the code transformation hook
  const { transformIndex, currentTransformation } = useCodeTransformation(codeTransformed);

  // Scene change effect - set immediate properties
  useEffect(() => {
    setHighlightedArtifacts(config.highlightedArtifacts);
    setZoomLevel(config.zoomLevel);
    setPanOffset(config.panOffset);
    setShowDirectiveEffect(config.showDirectiveEffect);
    setCodeTransformed(config.codeTransformed);

    // Clear previous animations
    setParticles([]);
    setEnergyBolts([]);
    setAnimatedConnections([]);
  }, [currentScene, config, setParticles, setEnergyBolts, setAnimatedConnections]);

  // Memoize callbacks to prevent infinite loops
  const sceneCallbacks = useMemo(() => ({
    onConnectionCreate: (connection: { from: string; to: string; type?: string }) => {
      const newConnection = createAnimatedConnection(connection.from, connection.to, connection.type);
      setAnimatedConnections(prev => [...prev, newConnection]);
    },
    onParticleCreate: (x: number, y: number, count: number, color: string) => {
      const newParticles = createParticles(x, y, count, color);
      setParticles(prev => [...prev, ...newParticles]);
    },
    onCodeTransform: () => {
      setCodeTransformed(true);
    }
  }), [setAnimatedConnections, setParticles]);

  // Use the scene effects hook for timer-based animations
  useSceneEffects(currentScene, config, artifactPositions, sceneCallbacks);

  return {
    highlightedArtifacts,
    zoomLevel,
    panOffset,
    showDirectiveEffect,
    codeTransformed,
    transformIndex,
    currentTransformation,
    particles,
    energyBolts,
    animatedConnections,
    artifactPositions,
    config
  };
};

interface DDMVisualizationProps {
  onSceneChange?: (scene: number) => void;
}

export const DDMVisualization: React.FC<DDMVisualizationProps> = ({ onSceneChange }) => {
  const { scrollProgress, currentScene } = useScrollProgress();
  const sceneData = useSceneManager(currentScene);

  // Notify parent component of scene changes
  React.useEffect(() => {
    onSceneChange?.(currentScene);
  }, [currentScene, onSceneChange]);

  return (
    <>
      {/* Fixed visualization panel */}
      <div className="w-full h-full bg-gray-950 border-r border-gray-900 overflow-hidden">
        <div 
          className="w-full h-full flex items-center justify-center overflow-hidden"
          style={{
            transform: `translate(${sceneData.panOffset.x}px, ${sceneData.panOffset.y}px) scale(${sceneData.zoomLevel})`,
            transformOrigin: 'center center',
            transition: 'transform 1s ease-out'
          }}
        >
          <svg
            width="900"
            height="700"
            viewBox="0 0 900 700"
            className="w-full h-full"
            style={{
              maxWidth: '100%',
              maxHeight: '100%'
            }}
          >
            {/* Definitions for gradients and effects */}
            <defs>
              <radialGradient id="backgroundGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(0, 229, 153, 0.1)" />
                <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
              </radialGradient>
              <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00E599" />
                <stop offset="100%" stopColor="#00B8FF" />
              </linearGradient>
              <linearGradient id="directiveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#00E599" />
              </linearGradient>
              <linearGradient id="spinGlowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00E599" stopOpacity="0.5" />
                <stop offset="50%" stopColor="#00E599" stopOpacity="1" />
                <stop offset="100%" stopColor="#00E599" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="codeGradientBorder" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00E599" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
              <linearGradient id="kpiGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
              <linearGradient id="whatifGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="30%" stopColor="#fbbf24" />
                <stop offset="80%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
              <linearGradient id="kpiToArchGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="50%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#00B8FF" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              <filter id="directiveGlow">
                <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Background grid pattern */}
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(100, 116, 139, 0.1)" strokeWidth="1"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            {/* Background glow */}
            <circle cx="450" cy="350" r="350" fill="url(#backgroundGradient)" opacity="0.5" />

            {/* Render rings */}
            {Object.entries(RINGS).map(([ringKey, ring]) => {
              const opacity = currentScene === 0 ? 0.8 : 
                             (currentScene === 1 && ringKey === 'inner') ? 1 :
                             (currentScene === 2 && ringKey === 'middle') ? 1 :
                             (currentScene === 3 && ringKey === 'outer') ? 1 :
                             (currentScene === 4 && ringKey === 'outer') ? 1 : 0.2;

              // Special gold color for outer ring in KPI scene (scene 4)
              const ringColor = (currentScene === 4 && ringKey === 'outer') ? 'rgba(251, 191, 36, 0.8)' : ring.color;

              return (
                <g key={ringKey}>
                  <circle
                    cx={450}
                    cy={350}
                    r={ring.radius}
                    fill="none"
                    stroke={ringColor}
                    strokeWidth="2"
                    opacity={opacity}
                    className="transition-all duration-1000"
                    style={{
                      filter: opacity > 0.5 ? `drop-shadow(0 0 10px ${ringColor === '#fbbf24' ? 'rgba(251, 191, 36, 0.4)' : 'rgba(0, 229, 153, 0.4)'})` : 'none'
                    }}
                  />
                  <text
                    x={450}
                    y={350 - ring.radius - 35}
                    textAnchor="middle"
                    fill={ringColor}
                    fontSize="14"
                    fontWeight="600"
                    opacity={opacity}
                    className="transition-all duration-1000"
                  >
                    {ring.label}
                  </text>
                </g>
              );
            })}
            
            {/* Render connections to INACTIVE nodes (background layer) */}
            {sceneData.animatedConnections.map((connection) => {
              const fromPos = sceneData.artifactPositions.find(p => p.type === connection.from);
              const toPos = sceneData.artifactPositions.find(p => p.type === connection.to);
              
              if (!fromPos || !toPos) return null;

              // Check if both nodes are inactive (not highlighted)
              const fromIsActive = sceneData.highlightedArtifacts.includes(connection.from);
              const toIsActive = sceneData.highlightedArtifacts.includes(connection.to);
              const bothInactive = !fromIsActive && !toIsActive;
              
              // Only render connections where both nodes are inactive
              if (!bothInactive) return null;

              // Determine stroke color based on scene and connection type
              let strokeColor;
              
              if (currentScene === 4) {
                // KPI scene
                if (connection.type === 'measure') {
                  strokeColor = 'url(#kpiToArchGradient)'; // gold to blue gradient for measurement connections
                } else if (connection.type === 'whatif') {
                  strokeColor = 'url(#whatifGradient)'; // green to gold gradient for what-if analysis
                } else {
                  strokeColor = '#fbbf24'; // gold for other KPI connections
                }
              } else if (currentScene === 3) {
                // Governance scene - all purple except directive to code
                if (connection.type === 'transform') {
                  strokeColor = 'url(#directiveGradient)'; // purple to green gradient
                } else {
                  strokeColor = '#a855f7'; // lighter purple for all governance
                }
              } else if (currentScene === 1) {
                // Feature Logic scene
                strokeColor = connection.type === 'drives' ? '#00E599' :
                             connection.type === 'verify' ? '#22c55e' :
                             connection.type === 'data' ? '#10b981' :
                             '#00E599';
              } else {
                // System Architecture scene
                strokeColor = connection.type === 'broadcast' ? '#2598a7' :
                             connection.type === 'expose' ? '#00B8FF' :
                             connection.type === 'sequence' ? '#00B8FF' :
                             connection.type === 'state' ? '#00B8FF' :
                             'url(#connectionGradient)';
              }

              // Calculate the current end point based on progress
              const currentX = fromPos.x + (toPos.x - fromPos.x) * connection.progress;
              const currentY = fromPos.y + (toPos.y - fromPos.y) * connection.progress;

              return (
                <g key={`${connection.id}-background`}>
                  {/* Animated line drawing */}
                  <line
                    x1={fromPos.x}
                    y1={fromPos.y}
                    x2={currentX}
                    y2={currentY}
                    stroke={strokeColor}
                    strokeWidth={connection.type === 'transform' ? '4' : 
                                connection.type === 'measure' ? '2' :
                                connection.type === 'whatif' ? '2.5' :
                                connection.type === 'broadcast' ? '1' : '2'}
                    className={connection.type === 'transform' ? 'animate-pulse' : ''}
                    opacity={0.3}
                    style={{
                      filter: `drop-shadow(0 0 ${connection.type === 'transform' ? '8' : '4'}px ${strokeColor === '#00E599' ? 'rgba(0, 229, 153, 0.8)' : 'rgba(0, 229, 153, 0.6)'})`
                    }}
                  />
                  {/* Animated flow particles along connections */}
                  {connection.progress >= 1 && (
                    <circle r="2" fill={strokeColor} opacity="0.3">
                      <animateMotion
                        dur="3s"
                        repeatCount="indefinite"
                        path={`M${fromPos.x},${fromPos.y} L${toPos.x},${toPos.y}`}
                      />
                    </circle>
                  )}
                  {/* Drawing head effect */}
                  {connection.progress < 1 && (
                    <circle
                      cx={currentX}
                      cy={currentY}
                      r="3"
                      fill={strokeColor}
                      opacity="0.4"
                      style={{
                        filter: `drop-shadow(0 0 6px ${strokeColor})`
                      }}
                    />
                  )}
                </g>
              );
            })}
            
            {/* Render energy bolts to INACTIVE nodes (background layer) */}
            {sceneData.energyBolts.map(bolt => {
              const currentX = bolt.fromX + (bolt.toX - bolt.fromX) * bolt.progress;
              const currentY = bolt.fromY + (bolt.toY - bolt.fromY) * bolt.progress;
              
              return (
                <g key={`${bolt.id}-background`}>
                  <line
                    x1={bolt.fromX}
                    y1={bolt.fromY}
                    x2={currentX}
                    y2={currentY}
                    stroke={bolt.color}
                    strokeWidth="2.5"
                    opacity="0.3"
                    style={{
                      filter: `drop-shadow(0 0 5px ${bolt.color})`
                    }}
                  />
                  <circle
                    cx={currentX}
                    cy={currentY}
                    r="3"
                    fill={bolt.color}
                    opacity="0.3"
                    style={{
                      filter: `drop-shadow(0 0 6px ${bolt.color})`
                    }}
                  />
                </g>
              );
            })}
            
            {/* Render particles */}
            {sceneData.particles.map(particle => (
              <circle
                key={particle.id}
                cx={particle.x}
                cy={particle.y}
                r={1.5}
                fill={particle.color}
                opacity={particle.life / particle.maxLife}
                style={{
                  filter: `drop-shadow(0 0 3px ${particle.color})`
                }}
              />
            ))}


            
            {/* Render INACTIVE artifacts (background layer) */}
            {sceneData.artifactPositions.map((position) => {
              const isHighlighted = sceneData.highlightedArtifacts.includes(position.type);
              
              // Only render inactive (non-highlighted) nodes
              if (isHighlighted) return null;
              
              const isCode = position.type === 'code';
              
              // Determine artifact color based on scene and ring
              let artifactColor = '#94a3b8'; // default gray
              let artifactBgColor = 'rgba(15, 23, 42, 0.95)'; // default background
              
              // Get cycling language for transformed code
              const showTransformed = isCode && sceneData.codeTransformed;
              const transformedText = showTransformed ? sceneData.currentTransformation : null;
              
              return (
                <g key={`${position.type}-inactive`}>
                  {/* Spinning glow effect for code node when transformed */}
                  {isCode && sceneData.codeTransformed && (
                    <g>
                      <defs>
                        <mask id={`spin-mask-${position.type}-inactive`}>
                          <rect width="100%" height="100%" fill="black" />
                          <circle
                            cx={position.x}
                            cy={position.y}
                            r="40"
                            fill="white"
                          />
                        </mask>
                      </defs>
                      <circle
                        cx={position.x}
                        cy={position.y}
                        r="40"
                        fill="none"
                        stroke="url(#spinGlowGradient)"
                        strokeWidth="4"
                        mask={`url(#spin-mask-${position.type}-inactive)`}
                        style={{
                          filter: 'blur(9px)',
                          animation: 'spin 4s linear infinite',
                          transformOrigin: `${position.x}px ${position.y}px`
                        }}
                        strokeDasharray="20 10 20 10"
                      />
                    </g>
                  )}
                  
                  {/* Solid background circle */}
                  <circle
                    cx={position.x}
                    cy={position.y}
                    r={24}
                    fill={artifactBgColor}
                    stroke="#475569"
                    strokeWidth={1}
                    className="transition-all duration-500"
                  />
                  {/* Icon */}
                  {showTransformed ? (
                    <text
                      x={position.x}
                      y={position.y}
                      textAnchor="middle"
                      dy="4"
                      fontSize="10"
                      fontWeight="bold"
                      fill="#ffffff"
                      className="transition-all duration-500"
                    >
                      {transformedText}
                    </text>
                  ) : (
                    <foreignObject
                      x={position.x - 12}
                      y={position.y - 12}
                      width="24"
                      height="24"
                      className="transition-all duration-500"
                    >
                      <div 
                        style={{ 
                          width: '24px', 
                          height: '24px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          color: artifactColor
                        }}
                      >
                        {ARTIFACT_ICONS[position.type as keyof typeof ARTIFACT_ICONS]}
                      </div>
                    </foreignObject>
                  )}
                  {/* Label background */}
                  <rect
                    x={position.x - (position.type.length * 3.5)}
                    y={position.y + 32}
                    width={position.type.length * 7}
                    height={16}
                    rx="4"
                    fill="rgba(0, 0, 0, 0.5)"
                    className="transition-all duration-500 border rounded-xl blur-sm"
                  />
                  {/* Label */}
                  <text
                    x={position.x}
                    y={position.y + 45}
                    textAnchor="middle"
                    fill="#64748b"
                    fontSize="11"
                    fontWeight="500"
                    className="transition-all duration-500"
                  >
                    {position.type}
                  </text>
                </g>
              );
            })}
            
            {/* Render connections to ACTIVE nodes (middle layer) */}
            {sceneData.animatedConnections.map((connection) => {
              const fromPos = sceneData.artifactPositions.find(p => p.type === connection.from);
              const toPos = sceneData.artifactPositions.find(p => p.type === connection.to);
              
              if (!fromPos || !toPos) return null;

              // Check if at least one node is active (highlighted)
              const fromIsActive = sceneData.highlightedArtifacts.includes(connection.from);
              const toIsActive = sceneData.highlightedArtifacts.includes(connection.to);
              const hasActiveNode = fromIsActive || toIsActive;
              
              // Only render connections where at least one node is active
              if (!hasActiveNode) return null;

              // Determine stroke color based on scene and connection type
              let strokeColor;
              
              if (currentScene === 4) {
                // KPI scene
                if (connection.type === 'measure') {
                  strokeColor = 'url(#kpiToArchGradient)'; // gold to blue gradient for measurement connections
                } else if (connection.type === 'whatif') {
                  strokeColor = 'url(#whatifGradient)'; // gold to green gradient for what-if analysis
                } else {
                  strokeColor = '#fbbf24'; // gold for other KPI connections
                }
              } else if (currentScene === 3) {
                // Governance scene - all purple except directive to code
                if (connection.type === 'transform') {
                  strokeColor = 'url(#directiveGradient)'; // purple to green gradient
                } else {
                  strokeColor = '#a855f7'; // lighter purple for all governance
                }
              } else if (currentScene === 1) {
                // Feature Logic scene
                strokeColor = connection.type === 'drives' ? '#00E599' :
                             connection.type === 'verify' ? '#22c55e' :
                             connection.type === 'data' ? '#10b981' :
                             '#00E599';
              } else {
                // System Architecture scene
                strokeColor = connection.type === 'broadcast' ? '#2598a7' :
                             connection.type === 'expose' ? '#00B8FF' :
                             connection.type === 'sequence' ? '#00B8FF' :
                             connection.type === 'state' ? '#00B8FF' :
                             'url(#connectionGradient)';
              }

              // Calculate the current end point based on progress
              const currentX = fromPos.x + (toPos.x - fromPos.x) * connection.progress;
              const currentY = fromPos.y + (toPos.y - fromPos.y) * connection.progress;

              return (
                <g key={`${connection.id}-middle`}>
                  {/* Animated line drawing */}
                  <line
                    x1={fromPos.x}
                    y1={fromPos.y}
                    x2={currentX}
                    y2={currentY}
                    stroke={strokeColor}
                    strokeWidth={connection.type === 'transform' ? '4' : 
                                connection.type === 'measure' ? '2' :
                                connection.type === 'whatif' ? '2.5' :
                                connection.type === 'broadcast' ? '1' : '2'}
                    className={connection.type === 'transform' ? 'animate-pulse' : ''}
                    opacity={0.8}
                    style={{
                      filter: `drop-shadow(0 0 ${connection.type === 'transform' ? '8' : '4'}px ${strokeColor === '#00E599' ? 'rgba(0, 229, 153, 0.8)' : 'rgba(0, 229, 153, 0.6)'})`
                    }}
                  />
                  {/* Animated flow particles along connections */}
                  {connection.progress >= 1 && (
                    <circle r="2" fill={strokeColor} opacity="0.6">
                      <animateMotion
                        dur="3s"
                        repeatCount="indefinite"
                        path={`M${fromPos.x},${fromPos.y} L${toPos.x},${toPos.y}`}
                      />
                    </circle>
                  )}
                  {/* Drawing head effect */}
                  {connection.progress < 1 && (
                    <circle
                      cx={currentX}
                      cy={currentY}
                      r="3"
                      fill={strokeColor}
                      opacity="0.9"
                      style={{
                        filter: `drop-shadow(0 0 6px ${strokeColor})`
                      }}
                    />
                  )}
                </g>
              );
            })}
            
            {/* Render energy bolts to ACTIVE nodes (middle layer) */}
            {sceneData.energyBolts.map(bolt => {
              const currentX = bolt.fromX + (bolt.toX - bolt.fromX) * bolt.progress;
              const currentY = bolt.fromY + (bolt.toY - bolt.fromY) * bolt.progress;
              
              return (
                <g key={`${bolt.id}-middle`}>
                  <line
                    x1={bolt.fromX}
                    y1={bolt.fromY}
                    x2={currentX}
                    y2={currentY}
                    stroke={bolt.color}
                    strokeWidth="2.5"
                    opacity="0.8"
                    style={{
                      filter: `drop-shadow(0 0 5px ${bolt.color})`
                    }}
                  />
                  <circle
                    cx={currentX}
                    cy={currentY}
                    r="3"
                    fill={bolt.color}
                    opacity="0.7"
                    style={{
                      filter: `drop-shadow(0 0 6px ${bolt.color})`
                    }}
                  />
                </g>
              );
            })}
            
            {/* Render ACTIVE artifacts (foreground layer) */}
            {sceneData.artifactPositions.map((position) => {
              const isHighlighted = sceneData.highlightedArtifacts.includes(position.type);
              
              // Only render active (highlighted) nodes
              if (!isHighlighted) return null;
              
              const isDirective = position.type === 'directive' && currentScene === 3;
              const isKpi = position.type === 'kpi' && currentScene === 4;
              const isCode = position.type === 'code';
              
              // Determine artifact color based on scene and ring
              let artifactColor = '#94a3b8'; // default gray
              let artifactBgColor = 'rgba(15, 23, 42, 0.95)'; // default background
              let strokeGradient = null;
              
              if (currentScene === 4) {
                // KPI scene
                if (position.type === 'kpi') {
                  artifactColor = '#fbbf24'; // vibrant gold for KPI
                  artifactBgColor = 'rgba(0, 0, 0, 0.95)'; // dark background for contrast
                  strokeGradient = 'url(#kpiGradient)'; // golden gradient border
                } else if (position.type === 'interaction' || position.type === 'api') {
                  artifactColor = '#00B8FF'; // blue for measured architecture components
                } else if (position.type === 'requirement') {
                  artifactColor = '#10b981'; // green for what-if analysis
                } else {
                  artifactColor = '#64748b'; // muted for other components
                }
              } else if (currentScene === 1) {
                artifactColor = '#00E599'; // green for feature logic
              } else if (currentScene === 2) {
                artifactColor = '#00B8FF'; // blue for system architecture
              } else if (currentScene === 3) {
                if (position.type === 'code') {
                  if (sceneData.codeTransformed) {
                    // Special black styling when transformed
                    artifactColor = '#00E599'; // green text for code
                    artifactBgColor = '#000000'; // solid black background for code
                    strokeGradient = 'url(#codeGradientBorder)'; // purple to green gradient border
                  } else {
                    // Normal highlighting before transformation
                    artifactColor = '#00E599'; // green for code (inner ring)
                  }
                } else {
                  artifactColor = position.ring === 'outer' ? '#a855f7' : '#00E599'; // lighter purple for governance, green for directive effects
                }
              }
              
              // Get cycling language for transformed code
              const showTransformed = isCode && sceneData.codeTransformed;
              const transformedText = showTransformed ? sceneData.currentTransformation : null;
              
              return (
                <g key={`${position.type}-active`}>
                  {/* Spinning glow effect for code node when transformed */}
                  {isCode && sceneData.codeTransformed && (
                    <g>
                      <defs>
                        <mask id={`spin-mask-${position.type}-active`}>
                          <rect width="100%" height="100%" fill="black" />
                          <circle
                            cx={position.x}
                            cy={position.y}
                            r="40"
                            fill="white"
                          />
                        </mask>
                      </defs>
                      <circle
                        cx={position.x}
                        cy={position.y}
                        r="40"
                        fill="none"
                        stroke="url(#spinGlowGradient)"
                        strokeWidth="4"
                        mask={`url(#spin-mask-${position.type}-active)`}
                        style={{
                          filter: 'blur(9px)',
                          animation: 'spin 4s linear infinite',
                          transformOrigin: `${position.x}px ${position.y}px`
                        }}
                        strokeDasharray="20 10 20 10"
                      />
                    </g>
                  )}
                  
                  {/* KPI pulsing glow effect */}
                  {isKpi && (
                    <circle
                      cx={position.x}
                      cy={position.y}
                      r="45"
                      fill="none"
                      stroke="#fbbf24"
                      strokeWidth="2"
                      opacity="0.6"
                      className="animate-pulse"
                      style={{
                        filter: 'blur(5px)',
                        animation: 'pulse 2s ease-in-out infinite'
                      }}
                    />
                  )}
                  
                  {/* Solid background circle */}
                  <circle
                    cx={position.x}
                    cy={position.y}
                    r={isDirective ? 32 : isKpi ? 30 : 28}
                    fill={artifactBgColor}
                    stroke={strokeGradient || artifactColor}
                    strokeWidth={isDirective ? 3 : isKpi ? 3 : 2}
                    className={`transition-all duration-500 ${isDirective ? 'animate-svg-glow-pulse' : ''}`}
                    style={{
                      filter: `drop-shadow(0 0 ${isDirective ? '20' : isKpi ? '18' : '15'}px ${artifactColor}40)`
                    }}
                  />
                  {/* Icon */}
                  {showTransformed ? (
                    <text
                      x={position.x}
                      y={position.y}
                      textAnchor="middle"
                      dy="4"
                      fontSize="10"
                      fontWeight="bold"
                      fill="#ffffff"
                      className="transition-all duration-500"
                    >
                      {transformedText}
                    </text>
                  ) : (
                    <foreignObject
                      x={position.x - 12}
                      y={position.y - 12}
                      width="24"
                      height="24"
                      className="transition-all duration-500"
                    >
                      <div 
                        style={{ 
                          width: '24px', 
                          height: '24px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          color: artifactColor
                        }}
                      >
                        {ARTIFACT_ICONS[position.type as keyof typeof ARTIFACT_ICONS]}
                      </div>
                    </foreignObject>
                  )}
                  {/* Label background */}
                  <rect
                    x={position.x - (position.type.length * 3.5)}
                    y={position.y + 32}
                    width={position.type.length * 7}
                    height={16}
                    rx="4"
                    fill="rgba(0, 0, 0, 0.5)"
                    className="transition-all duration-500"
                  />
                  {/* Label */}
                  <text
                    x={position.x}
                    y={position.y + 45}
                    textAnchor="middle"
                    fill={
                      (position.type === 'code' && sceneData.codeTransformed) ? '#ffffff' :
                      artifactColor
                    }
                    fontSize="11"
                    fontWeight="500"
                    className="transition-all duration-500 text-shadow shadow-black"
                  >
                    {position.type}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Progress indicator */}
        <div className="sticky bottom-8 left-8 w-64 h-2 bg-gray-800 rounded-full overflow-hidden z-50">
            <div 
            className="h-full bg-gradient-to-r from-neon-green to-neon-blue transition-all duration-300"
            style={{ width: `${scrollProgress * 100}%` }}
            />
        </div>

        {/* Scene indicator */}
        <div className="sticky bottom-12 left-8 w-64 h-5 text-sm text-gray-400 z-50">
            Scene {currentScene + 1} of 5
        </div>
      </div>
    </>
  );
}; 