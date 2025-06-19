import React, { useState } from 'react';
import { CaretRight, DiscordLogo, GithubLogo } from 'phosphor-react';
import { ArtifactDetails } from './ArtifactDetails';

// Component imports from the main file
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
import SocialButton from './SocialButton';

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

// Animated Words Component
const AnimatedWords: React.FC = () => {
  return (
    <div className="animated-words-container text-white">
      <ul className="list-none p-0 m-0 -mx-16">
        <li className="words-line">
          <p>&nbsp;</p>
          <p>Definitive</p>
        </li>
        <li className="words-line">
          <p>Definitive</p>
          <p>Specification</p>
        </li>
        <li className="words-line">
          <p>Specification</p>
          <p style={{marginLeft: '36px'}}>Data Model</p>
        </li>
        <li className="words-line">
          <p style={{marginLeft: '36px'}}>Data Model</p>
          <p>&nbsp;</p>
        </li>
      </ul>
    </div>
  );
};

// Expandable Artifact Item Component
interface ExpandableArtifactItemProps {
  artifactType: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  isExpanded: boolean;
  onToggle: () => void;
}

const ExpandableArtifactItem: React.FC<ExpandableArtifactItemProps> = ({
  artifactType,
  icon,
  title,
  description,
  color,
  isExpanded,
  onToggle
}) => {
  return (
    <div className="border border-gray-700/50 rounded-lg overflow-hidden transition-all duration-300 hover:border-gray-600/50">
      <div 
        className="flex items-center gap-3 p-3 rounded-t-lg transition-colors hover:bg-gray-800/50 cursor-pointer"
        onClick={onToggle}
      >
        <div className="w-6 h-6 flex items-center justify-center text-lg" style={{ color }}>
          {icon}
        </div>
        <span className="flex-1">
          <code style={{ color }}>{artifactType}</code>: 
          <span className='text-gray-100'> {title}</span>
          <p className='text-gray-400 text-sm'>{description}</p>
        </span>
        <div className="text-gray-400 transition-transform duration-200" style={{ 
          transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' 
        }}>
          <CaretRight size={16} />
        </div>
      </div>
      
      <div 
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ 
          maxHeight: isExpanded ? '590px' : '0px',
          opacity: isExpanded ? 1 : 0
        }}
      >
        <ArtifactDetails artifactType={artifactType} color={color} />
      </div>
    </div>
  );
};

interface ContentSectionsProps {
  currentScene: number;
}

export const ContentSections: React.FC<ContentSectionsProps> = ({
  currentScene
}) => {

  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const onToggleExpand = (artifactType: string) => {
    setExpandedItem(expandedItem === artifactType ? null : artifactType);
  };

  return (
    <div className="bg-[#03070e] overflow-hidden">
      {/* Initial section */}
      <section className="h-screen w-full flex items-center">
        <div className="max-w-lg">
          <div className='flex flex-col items-center justify-between'>
            <div className="mb-6 h-[400px] w-[500px] ml-20">
              <AnimatedWords />
            </div>
            <div className="text-sm text-neon-blue animate-pulse">
              ↓ Scroll to explore the system
            </div>
            {/* Social Media Buttons */}
            <div className="absolute top-5 right-0 h-20 flex justify-center items-center gap-4 w-2/5 opacity-20 hover:opacity-100 transition-opacity duration-300">
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
        </div>
        </div>
      </section>

      {/* Feature Logic section */}
      <section className="h-screen flex items-center justify-center p-12">
        <div className="max-w-lg">
          <h2 className="text-5xl font-bold mb-8 text-neon-green uppercase tracking-tighter">
            <p className='leading-[.8em]'>
              <span className="text-4xl leading-[.8em]">Part 1: </span>
              <span className='text-7xl leading-[.8em]'>The Core</span>
            </p>
            <p className="text-gray-200 text-6xl leading-[.8em]">Implementing <br/>a Feature</p>
          </h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            At the heart of any system is the feature. Definitive Development Methodology provides a tight loop of artifacts 
            to define, implement, and verify this core logic with absolute clarity.
          </p>
          <div className="space-y-3 text-gray-400">
            <ExpandableArtifactItem
              artifactType="requirement"
              icon={ARTIFACT_ICONS.requirement}
              title="Defines the Goal"
              description=""
              color="#00E599"
              isExpanded={expandedItem === 'requirement'}
              onToggle={() => onToggleExpand('requirement')}
            />
            <ExpandableArtifactItem
              artifactType="model"
              icon={ARTIFACT_ICONS.model}
              title="Shapes the Data"
              description=""
              color="#00B8FF"
              isExpanded={expandedItem === 'model'}
              onToggle={() => onToggleExpand('model')}
            />
            <ExpandableArtifactItem
              artifactType="code"
              icon={ARTIFACT_ICONS.code}
              title="Details the Logic"
              description=""
              color="#ffffff"
              isExpanded={expandedItem === 'code'}
              onToggle={() => onToggleExpand('code')}
            />
            <ExpandableArtifactItem
              artifactType="test"
              icon={ARTIFACT_ICONS.test}
              title="Provides the Proof"
              description=""
              color="#22c55e"
              isExpanded={expandedItem === 'test'}
              onToggle={() => onToggleExpand('test')}
            />
          </div>
        </div>
      </section>

      {/* System Architecture section */}
      <section className="min-h-screen flex items-center justify-center p-12">
        <div className="max-w-lg">
          <h2 className="text-5xl font-bold mb-8 text-neon-blue uppercase tracking-tighter">
            <p className='leading-[.8em]'>
              <span className="text-4xl leading-[.1em]">Part 2: </span>
              <span className='text-5xl leading-[.1em]'>The Structure</span>
            </p>
            <p className="text-gray-200 text-[4.1rem] leading-[.8em]">Architecting <br/>the System</p>
          </h2>
          <p className="text-lg text-gray-300 mb-6 leading-relaxed">
            Features don't live in isolation. You need to define how they fit into the bigger picture. These artifacts build the architectural blueprint and model how components interact.
          </p>
          <div className="space-y-3 text-gray-400">
            <ExpandableArtifactItem
              artifactType="design"
              icon={ARTIFACT_ICONS.design}
              title="The Components"
              description="Defines the high-level responsibilities of services"
              color="#00B8FF"
              isExpanded={expandedItem === 'design'}
              onToggle={() => onToggleExpand('design')}
            />
            <ExpandableArtifactItem
              artifactType="api"
              icon={ARTIFACT_ICONS.api}
              title="The Contracts"
              description="Specifies how components talk to each other"
              color="#3b82f6"
              isExpanded={expandedItem === 'api'}
              onToggle={() => onToggleExpand('api')}
            />
            <ExpandableArtifactItem
              artifactType="interaction"
              icon={ARTIFACT_ICONS.interaction}
              title="The Choreography"
              description="Models the sequence of communication between components"
              color="#06b6d4"
              isExpanded={expandedItem === 'interaction'}
              onToggle={() => onToggleExpand('interaction')}
            />
            <ExpandableArtifactItem
              artifactType="behavior"
              icon={ARTIFACT_ICONS.behavior}
              title="The Lifecycle"
              description="The internal state and transitions of complex components"
              color="#a855f7"
              isExpanded={expandedItem === 'behavior'}
              onToggle={() => onToggleExpand('behavior')}
            />
            <ExpandableArtifactItem
              artifactType="event"
              icon={ARTIFACT_ICONS.event}
              title="The Announcements"
              description="Decouples components through asynchronous messages"
              color="#6366f1"
              isExpanded={expandedItem === 'event'}
              onToggle={() => onToggleExpand('event')}
            />
          </div>
        </div>
      </section>

      {/* Governance section */}
      <section className="min-h-screen flex items-center justify-center p-12">
        <div className=" max-w-lg">
          <h2 className="text-5xl font-bold mb-8 text-purple-400 uppercase tracking-tighter">
            <p className='leading-[.8em]'>
              <span className="text-3xl leading-[.1em]">Part 3: </span>
              <span className='text-[2.6rem] leading-[.1em]'>The Governance</span>
            </p>
            <p className="text-gray-200 text-[4.55rem] leading-[.77em]">Enforcing <br/>the Rules</p>
          </h2>
          <p className="text-lg text-gray-300 mb-6 leading-relaxed">
            A robust system needs rules that apply everywhere. These artifacts allow you to define system-wide policies, terminology, and <i>most importantly</i> how the AI agent should behave. This is how you achieve consistency at scale.
          </p>
          <div className="space-y-3 text-gray-400">
            <ExpandableArtifactItem
              artifactType="policy"
              icon={ARTIFACT_ICONS.policy}
              title="Enforcing System-Wide Rules"
              description="Centralizes rules for errors"
              color="#a855f7"
              isExpanded={expandedItem === 'policy'}
              onToggle={() => onToggleExpand('policy')}
            />
            <ExpandableArtifactItem
              artifactType="nfr"
              icon={ARTIFACT_ICONS.nfr}
              title="Defining Quality"
              description="Non-Functional Requirements as a formal part"
              color="#eab308"
              isExpanded={expandedItem === 'nfr'}
              onToggle={() => onToggleExpand('nfr')}
            />
            <ExpandableArtifactItem
              artifactType="infra"
              icon={ARTIFACT_ICONS.infra}
              title="The Environment"
              description="Specifies configuration and deployment details"
              color="#f97316"
              isExpanded={expandedItem === 'infra'}
              onToggle={() => onToggleExpand('infra')}
            />
            <ExpandableArtifactItem
              artifactType="glossary"
              icon={ARTIFACT_ICONS.glossary}
              title="The Dictionary"
              description="Creates a shared understanding of terms"
              color="#7dd3fc"
              isExpanded={expandedItem === 'glossary'}
              onToggle={() => onToggleExpand('glossary')}
            />
            <div className="relative">
              <ExpandableArtifactItem
                artifactType="directive"
                icon={ARTIFACT_ICONS.directive}
                title="The AI's Brain"
                description="You program the agent by defining patterns to translate abstract logic into concrete code. This is your control panel."
                color="#00E599"
                isExpanded={expandedItem === 'directive'}
                onToggle={() => onToggleExpand('directive')}
              />
              <div className="absolute -inset-1 bg-gradient-to-r from-neon-green/20 to-transparent rounded-lg pointer-events-none animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* KPI section */}
      <section className="min-h-screen flex items-center justify-center p-12">
        <div className="max-w-lg">
          <h2 className="text-5xl font-bold mb-8 text-yellow-400 uppercase tracking-tighter">
            <p className='leading-[.8em]'>
              <span className="text-4xl leading-[.1em]">Part 4: </span>
              <span className='text-[3.2rem] leading-[.1em]'>The Metrics</span>
            </p>
            <p className="text-gray-200 text-[4.9rem] leading-[.77em] -ml-1">Measuring</p>
            <p className="text-gray-200 text-[3.67rem] leading-[.77em]">What Matters</p>
          </h2>
          <p className="text-lg text-gray-300 mb-6 leading-relaxed">
            Business value is the ultimate test of any system. KPIs connect your technical architecture to business outcomes, enabling powerful what-if analysis and data-driven decision making.
          </p>
          <div className="space-y-3 text-gray-400">
            <div className="relative">
              <ExpandableArtifactItem
                artifactType="kpi"
                icon={ARTIFACT_ICONS.kpi}
                title="Business Intelligence"
                description="The Measure of Business Value"
                color="#fbbf24"
                isExpanded={expandedItem === 'kpi'}
                onToggle={() => onToggleExpand('kpi')}
              />
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400/20 to-transparent rounded-lg pointer-events-none animate-pulse"></div>
            </div>
            <div className="mt-6 p-4 bg-gray-900/50 rounded-lg border border-yellow-400/20">
              <h4 className="text-yellow-400 font-semibold mb-2">✨ What-If Analysis</h4>
              <p className="text-sm text-gray-300">
              Because the agent understands the link between <code className="text-green-400">requirements</code>, <code className="text-green-400">code</code>, and KPIs, it can run a virtual simulation to predict the future. This creates a feedback loop 
              between business strategy and technical implementation.
              <br/>Before you write a line of code for a new feature, you can ask:
              <br/><br/><i>- "What is the projected impact of requirement.AddNewPaymentMethod on kpi.CheckoutConversionRate?"</i>
              <br/><br/>The agent analyzes the proposed changes, simulates user flows, and provides a data-driven forecast, turning strategic planning from guesswork into a science.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}; 