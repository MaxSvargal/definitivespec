import React from 'react';
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
  TrendUp,
  DiscordLogo,
  GithubLogo
} from 'phosphor-react';
import SocialButton from './SocialButton';

// Constants
const ARTIFACT_ICONS = {
  requirement: <ListChecks size={20} weight="duotone" />,
  code: <CodeSimple size={20} weight="duotone" />,
  test: <ShieldCheck size={20} weight="thin" />,
  model: <TreeStructure size={20} weight="thin" />,
  design: <SelectionAll size={20} weight="thin" />,
  api: <PlugsConnected size={20} weight="thin" />,
  interaction: <Graph size={20} weight="thin" />,
  behavior: <Repeat size={20} weight="thin" />,
  event: <Broadcast size={20} weight="thin" />,
  policy: <Scales size={20} weight="thin" />,
  nfr: <Gauge size={20} weight="thin" />,
  infra: <Database size={20} weight="thin" />,
  glossary: <BookOpen size={20} weight="thin" />,
  directive: <Robot size={20} weight="thin" />,
  kpi: <TrendUp size={20} weight="thin" />
} as const;

// Mobile Hero Component
export const MobileHero: React.FC = () => {
  return (
    <section className="min-h-screen bg-[#03070e] flex flex-col relative">
      {/* Social Media Buttons - Mobile positioned */}
      <div className="absolute top-6 right-6 flex justify-center w-full pl-12 gap-3 opacity-70 hover:opacity-100 transition-opacity duration-300 z-10">
        <SocialButton
          Icon={DiscordLogo}
          name="Discord"
          href="https://discord.gg/Bs6UdvWF"
          colors={{
            main: '#5865F2',
            before: '#4752C4',
            after: '#7983F5'
          }}
        />
        <SocialButton
          Icon={GithubLogo}
          name="GitHub"
          href="https://github.com/ArchitectLM/DDM"
          colors={{
            main: '#333333',
            before: '#24292e',
            after: '#586069'
          }}
        />
      </div>

      <div className="flex-1 flex items-center justify-center p-6 pt-20">
        <div className="text-center max-w-sm">
          {/* Simplified DDM Visualization */}
          <div className="mb-8">
            <div className="w-48 h-48 mx-auto relative">
              <svg viewBox="0 0 192 192" className="w-full h-full">
                {/* Background gradient */}
                <defs>
                  <radialGradient id="mobileGradient" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="rgba(0, 229, 153, 0.1)" />
                    <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
                  </radialGradient>
                </defs>
                <circle cx="96" cy="96" r="90" fill="url(#mobileGradient)" />
                
                {/* Rings */}
                <circle cx="96" cy="96" r="45" fill="none" stroke="#00E599" strokeWidth="2" opacity="0.8" className="animate-pulse" />
                <circle cx="96" cy="96" r="65" fill="none" stroke="#00B8FF" strokeWidth="2" opacity="0.6" />
                <circle cx="96" cy="96" r="85" fill="none" stroke="#a855f7" strokeWidth="2" opacity="0.4" />
                
                {/* Central element */}
                <circle cx="96" cy="96" r="15" fill="#00E599" opacity="0.9" />
                <text x="96" y="102" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">DDM</text>
                
                {/* Floating dots */}
                <circle cx="96" cy="51" r="3" fill="#00E599" opacity="0.7">
                  <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="141" cy="96" r="3" fill="#00B8FF" opacity="0.7">
                  <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" begin="0.5s" />
                </circle>
                <circle cx="96" cy="141" r="3" fill="#a855f7" opacity="0.7">
                  <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" begin="1s" />
                </circle>
                <circle cx="51" cy="96" r="3" fill="#fbbf24" opacity="0.7">
                  <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" begin="1.5s" />
                </circle>
              </svg>
            </div>
          </div>
          
          {/* Mobile-optimized animated title */}
          <div className="mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-white leading-tight">
              Definitive
            </h1>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-white leading-tight">
              Development
            </h1>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-white leading-tight">
              Methodology
            </h1>
          </div>
          
          <p className="text-base text-gray-300 mb-8 leading-relaxed">
            A comprehensive system for AI-native software development. Transform precise specifications into high-quality, verified software.
          </p>
          
          <div className="text-sm text-neon-blue animate-pulse">
            ↓ Scroll to explore the methodology
          </div>
        </div>
      </div>
    </section>
  );
};

// Mobile Section Divider Component
interface MobileSectionDividerProps {
  title: string;
  subtitle: string;
  color: string;
  ringColor: string;
  partNumber: string;
}

export const MobileSectionDivider: React.FC<MobileSectionDividerProps> = ({
  title,
  subtitle,
  color,
  ringColor,
  partNumber
}) => {
  return (
    <div className="text-center mb-8">
      <div className="w-24 h-24 mx-auto mb-6 relative">
        <svg viewBox="0 0 96 96" className="w-full h-full">
          <circle cx="48" cy="48" r="40" fill="none" stroke={ringColor} strokeWidth="2" opacity="0.8" />
          <circle cx="48" cy="48" r="12" fill={ringColor} opacity="0.8" />
          <circle cx="48" cy="48" r="6" fill="white" opacity="0.9" />
        </svg>
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color }}>
        {title}
      </h2>
      <p className="text-xs text-gray-400 mb-2">{partNumber}</p>
      <p className="text-base text-gray-200 font-medium">{subtitle}</p>
    </div>
  );
};

// Mobile Artifact Card Component
interface MobileArtifactCardProps {
  type: keyof typeof ARTIFACT_ICONS;
  title: string;
  color: string;
  description: string;
}

export const MobileArtifactCard: React.FC<MobileArtifactCardProps> = ({
  type,
  title,
  color,
  description
}) => {
  return (
    <div className="bg-gray-950/50 border border-gray-700/50 rounded-lg p-4 hover:border-gray-600/50 transition-all duration-300">
      <div className="flex items-start gap-3">
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" 
          style={{ backgroundColor: `${color}20` }}
        >
          <div style={{ color }}>
            {ARTIFACT_ICONS[type]}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white mb-1 text-sm">
            <code style={{ color }} className="text-xs">{type}</code>: {title}
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
};

// Mobile Content Sections Component
export const MobileContentSections: React.FC = () => {
  return (
    <div className="bg-[#03070e]">
      {/* Part 1: The Core */}
      <section className="py-12 px-6 border-t border-gray-800">
        <div className="max-w-sm mx-auto">
          <MobileSectionDivider
            title="The Core"
            subtitle="Implementing a Feature"
            color="#00E599"
            ringColor="#00E599"
            partNumber="Part 1"
          />
          
          <p className="text-gray-300 mb-8 text-center text-sm leading-relaxed">
            At the heart of any system is the feature. DDM provides a tight loop of artifacts 
            to define, implement, and verify core logic with absolute clarity.
          </p>
          
          <div className="space-y-3">
            <MobileArtifactCard 
              type="requirement" 
              title="Defines the Goal" 
              color="#00E599"
              description="Captures business intent and success criteria with precision"
            />
            <MobileArtifactCard 
              type="model" 
              title="Shapes the Data" 
              color="#00B8FF"
              description="Defines data structures, relationships, and constraints"
            />
            <MobileArtifactCard 
              type="code" 
              title="Details the Logic" 
              color="#ffffff"
              description="Specifies abstract implementation logic and algorithms"
            />
            <MobileArtifactCard 
              type="test" 
              title="Provides the Proof" 
              color="#22c55e"
              description="Validates functionality against requirements and edge cases"
            />
          </div>
        </div>
      </section>

      {/* Part 2: The Structure */}
      <section className="py-12 px-6 border-t border-gray-800">
        <div className="max-w-sm mx-auto">
          <MobileSectionDivider
            title="The Structure"
            subtitle="Architecting the System"
            color="#00B8FF"
            ringColor="#00B8FF"
            partNumber="Part 2"
          />
          
          <p className="text-gray-300 mb-8 text-center text-sm leading-relaxed">
            Features don't live in isolation. These artifacts build the architectural blueprint 
            and model how components interact at scale.
          </p>
          
          <div className="space-y-3">
            <MobileArtifactCard 
              type="design" 
              title="The Components" 
              color="#00B8FF"
              description="Defines high-level service responsibilities and boundaries"
            />
            <MobileArtifactCard 
              type="api" 
              title="The Contracts" 
              color="#3b82f6"
              description="Specifies how components communicate with each other"
            />
            <MobileArtifactCard 
              type="interaction" 
              title="The Choreography" 
              color="#06b6d4"
              description="Models complex sequences of component communication"
            />
            <MobileArtifactCard 
              type="behavior" 
              title="The Lifecycle" 
              color="#a855f7"
              description="Internal state machines and component transitions"
            />
            <MobileArtifactCard 
              type="event" 
              title="The Announcements" 
              color="#6366f1"
              description="Decouples components through asynchronous messaging"
            />
          </div>
        </div>
      </section>

      {/* Part 3: The Governance */}
      <section className="py-12 px-6 border-t border-gray-800">
        <div className="max-w-sm mx-auto">
          <MobileSectionDivider
            title="The Governance"
            subtitle="Enforcing the Rules"
            color="#a855f7"
            ringColor="#a855f7"
            partNumber="Part 3"
          />
          
          <p className="text-gray-300 mb-8 text-center text-sm leading-relaxed">
            Robust systems need consistent rules. These artifacts define system-wide policies, 
            terminology, and most importantly, how the AI agent behaves.
          </p>
          
          <div className="space-y-3">
            <MobileArtifactCard 
              type="policy" 
              title="System-Wide Rules" 
              color="#a855f7"
              description="Centralizes error handling and business rule enforcement"
            />
            <MobileArtifactCard 
              type="nfr" 
              title="Quality Standards" 
              color="#eab308"
              description="Non-functional requirements as formal specifications"
            />
            <MobileArtifactCard 
              type="infra" 
              title="The Environment" 
              color="#f97316"
              description="Configuration, deployment, and infrastructure details"
            />
            <MobileArtifactCard 
              type="glossary" 
              title="Shared Language" 
              color="#7dd3fc"
              description="Creates consistent understanding of domain terms"
            />
            <div className="relative">
              <MobileArtifactCard 
                type="directive" 
                title="The AI's Brain" 
                color="#00E599"
                description="Program the agent by defining patterns to translate specs into code"
              />
              <div className="absolute -inset-1 bg-gradient-to-r from-neon-green/20 to-transparent rounded-lg pointer-events-none animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Part 4: The Metrics */}
      <section className="py-12 px-6 border-t border-gray-800">
        <div className="max-w-sm mx-auto">
          <MobileSectionDivider
            title="The Metrics"
            subtitle="Measuring What Matters"
            color="#fbbf24"
            ringColor="#fbbf24"
            partNumber="Part 4"
          />
          
          <p className="text-gray-300 mb-8 text-center text-sm leading-relaxed">
            Business value is the ultimate test. KPIs connect technical architecture 
            to business outcomes, enabling data-driven decisions.
          </p>
          
          <div className="space-y-3">
            <div className="relative">
              <MobileArtifactCard 
                type="kpi" 
                title="Business Intelligence" 
                color="#fbbf24"
                description="The measure of business value and system success"
              />
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400/20 to-transparent rounded-lg pointer-events-none animate-pulse"></div>
            </div>
            
            <div className="mt-6 p-4 bg-gray-900/50 rounded-lg border border-yellow-400/20">
              <h4 className="text-yellow-400 font-semibold mb-2 text-sm">✨ What-If Analysis</h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                The agent understands links between requirements, code, and KPIs. Run virtual simulations 
                to predict impact before implementation. Turn strategic planning from guesswork into science.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}; 