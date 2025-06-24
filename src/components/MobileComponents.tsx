import React, { useState } from 'react';
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
  GithubLogo,
  CaretRight
} from 'phosphor-react';
import SocialButton from './SocialButton';
import { ArtifactDetails } from './ArtifactDetails';

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
// Animated Words Component
const MobileAnimatedWords: React.FC = () => {
  return (
    <div className="pl-2 h-[270px] w-full scale-[.7] -ml-20 ">
    <div className="animated-words-container text-white w-full">
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
    </div>
  );
};

// Mobile Hero Component
export const MobileHero: React.FC = () => {
  return (
    <section className="min-h-screen bg-[#03070e] flex flex-col relative">


      <div className="flex-1 flex items-center justify-center px-6">
        <div className="text-center max-w-lg">
          {/* Enhanced DDM Visualization with corrected positions */}
          <div className="mb-6">
            <div className="w-80 h-80 mx-auto relative">
              <svg viewBox="0 0 320 320" className="w-full h-full">
                {/* Background gradient */}
                <defs>
                  <radialGradient id="mobileGradient" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="rgba(0, 229, 153, 0.15)" />
                    <stop offset="50%" stopColor="rgba(0, 184, 255, 0.1)" />
                    <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
                  </radialGradient>
                  <linearGradient id="ringGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00E599" />
                    <stop offset="100%" stopColor="#00E599" stopOpacity="0.6" />
                  </linearGradient>
                  <linearGradient id="ringGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00B8FF" />
                    <stop offset="100%" stopColor="#00B8FF" stopOpacity="0.6" />
                  </linearGradient>
                  <linearGradient id="ringGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity="0.6" />
                  </linearGradient>
                </defs>
                
                <circle cx="160" cy="160" r="150" fill="url(#mobileGradient)" />
                
                {/* Rings - Feature Logic (inner) - radius ~70 */}
                <circle cx="160" cy="160" r="70" fill="none" stroke="url(#ringGradient1)" strokeWidth="2" opacity="0.9" className="animate-pulse" style={{ animationDuration: '3s' }} />
                <text x="160" y="80" textAnchor="middle" fill="#00E599" fontSize="10" fontWeight="600" opacity="0.8">Feature Logic</text>
                
                {/* Rings - System Architecture (middle) - radius ~105 */}
                <circle cx="160" cy="160" r="105" fill="none" stroke="url(#ringGradient2)" strokeWidth="2" opacity="0.7" />
                <text x="160" y="45" textAnchor="middle" fill="#00B8FF" fontSize="10" fontWeight="600" opacity="0.7">System Architecture</text>
                
                {/* Rings - Governance & Rules (outer) - radius ~140 */}
                <circle cx="160" cy="160" r="140" fill="none" stroke="url(#ringGradient3)" strokeWidth="2" opacity="0.5" />
                <text x="160" y="10" textAnchor="middle" fill="#a855f7" fontSize="10" fontWeight="600" opacity="0.6">Governance & Rules</text>
                
                {/* Central element */}
                <circle cx="160" cy="160" r="22" fill="#00E599" opacity="0.9" />
                <text x="160" y="166" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">DDM</text>
                
                {/* Inner ring artifacts - positioned correctly around radius 70 */}
                {/* requirement - top */}
                <circle cx="160" cy="90" r="4" fill="#00E599" opacity="0.8">
                  <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />
                </circle>
                {/* code - right */}
                <circle cx="230" cy="160" r="4" fill="#00E599" opacity="0.8">
                  <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" begin="0.5s" />
                </circle>
                {/* test - bottom */}
                <circle cx="160" cy="230" r="4" fill="#00E599" opacity="0.8">
                  <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" begin="1s" />
                </circle>
                {/* model - left */}
                <circle cx="90" cy="160" r="4" fill="#00E599" opacity="0.8">
                  <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" begin="1.5s" />
                </circle>
                
                {/* Middle ring artifacts - positioned around radius 105 */}
                {/* design - top */}
                <circle cx="160" cy="55" r="3" fill="#00B8FF" opacity="0.7">
                  <animate attributeName="opacity" values="0.7;1;0.7" dur="2.5s" repeatCount="indefinite" begin="0.3s" />
                </circle>
                {/* api - top-right */}
                <circle cx="234" cy="86" r="3" fill="#00B8FF" opacity="0.7">
                  <animate attributeName="opacity" values="0.7;1;0.7" dur="2.5s" repeatCount="indefinite" begin="0.8s" />
                </circle>
                {/* interaction - bottom-right */}
                <circle cx="234" cy="234" r="3" fill="#00B8FF" opacity="0.7">
                  <animate attributeName="opacity" values="0.7;1;0.7" dur="2.5s" repeatCount="indefinite" begin="1.3s" />
                </circle>
                {/* behavior - bottom-left */}
                <circle cx="86" cy="234" r="3" fill="#00B8FF" opacity="0.7">
                  <animate attributeName="opacity" values="0.7;1;0.7" dur="2.5s" repeatCount="indefinite" begin="1.8s" />
                </circle>
                {/* event - top-left */}
                <circle cx="86" cy="86" r="3" fill="#00B8FF" opacity="0.7">
                  <animate attributeName="opacity" values="0.7;1;0.7" dur="2.5s" repeatCount="indefinite" begin="2.3s" />
                </circle>
                
                {/* Outer ring artifacts - positioned around radius 140 */}
                {/* policy - top */}
                <circle cx="160" cy="20" r="2.5" fill="#a855f7" opacity="0.6">
                  <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite" begin="0.2s" />
                </circle>
                {/* nfr - top-right */}
                <circle cx="259" cy="61" r="2.5" fill="#eab308" opacity="0.6">
                  <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite" begin="0.7s" />
                </circle>
                {/* infra - right */}
                <circle cx="300" cy="160" r="2.5" fill="#f97316" opacity="0.6">
                  <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite" begin="1.2s" />
                </circle>
                {/* glossary - bottom-right */}
                <circle cx="259" cy="259" r="2.5" fill="#7dd3fc" opacity="0.6">
                  <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite" begin="1.7s" />
                </circle>
                {/* kpi - bottom */}
                <circle cx="160" cy="300" r="2.5" fill="#fbbf24" opacity="0.6">
                  <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite" begin="2.2s" />
                </circle>
                {/* directive - left */}
                <circle cx="20" cy="160" r="2.5" fill="#00E599" opacity="0.6">
                  <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite" begin="2.7s" />
                </circle>
              </svg>
            </div>
          </div>
          
          {/* Original animated title */}
          <div className="-mt-10 pl-4 relative w-full">
            <MobileAnimatedWords />
          </div>
          
          {/* Original description text */}
          <p className="text-sm text-gray-300 mb-8 leading-relaxed">
            DefinitiveSpec provides a comprehensive set of artifacts to model every aspect of your system. This toolkit is the foundation of our AI-native methodology, transforming precise specifications into high-quality, verified software.
          </p>
          
          <div className="text-sm text-neon-blue animate-pulse">
            ↓ Scroll to explore the system
          </div>
        </div>
      </div>
    </section>
  );
};

// Mobile Section Divider Component (enhanced)
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
          <defs>
            <radialGradient id={`sectionGradient-${partNumber}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={`${ringColor}30`} />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
          <circle cx="48" cy="48" r="45" fill={`url(#sectionGradient-${partNumber})`} />
          <circle cx="48" cy="48" r="35" fill="none" stroke={ringColor} strokeWidth="2" opacity="0.8" />
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

// Mobile Expandable Artifact Item Component
interface MobileExpandableArtifactItemProps {
  artifactType: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  isExpanded: boolean;
  onToggle: () => void;
}

export const MobileExpandableArtifactItem: React.FC<MobileExpandableArtifactItemProps> = ({
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
          <code style={{ color }} className="text-sm">{artifactType}</code>: 
          <span className='text-gray-100 text-sm'> {title}</span>
          {description && <p className='text-gray-400 text-xs mt-1'>{description}</p>}
        </span>
        <div className="text-gray-400 transition-transform duration-200" style={{ 
          transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' 
        }}>
          <CaretRight size={14} />
        </div>
      </div>
      
      <div 
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ 
          maxHeight: isExpanded ? '100vh' : '0px',
          opacity: isExpanded ? 1 : 0
        }}
      >
        <ArtifactDetails artifactType={artifactType} color={color} />
      </div>
    </div>
  );
};

// Mobile Content Sections Component
export const MobileContentSections: React.FC = () => {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const onToggleExpand = (artifactType: string) => {
    setExpandedItem(expandedItem === artifactType ? null : artifactType);
  };

  return (
    <div className="bg-[#03070e]">
      {/* Part 1: The Core */}
      <section className="py-12 px-6 border-t border-gray-800">
        <div className="max-w-lg mx-auto">
          <MobileSectionDivider
            title="The Core"
            subtitle="Implementing a Feature"
            color="#00E599"
            ringColor="#00E599"
            partNumber="Part 1"
          />
          
          <p className="text-gray-300 mb-8 text-center text-sm leading-relaxed">
            At the heart of any system is the feature. Definitive Development Methodology provides a tight loop of artifacts 
            to define, implement, and verify this core logic with absolute clarity.
          </p>
          
          <div className="space-y-3">
            <MobileExpandableArtifactItem
              artifactType="requirement"
              icon={ARTIFACT_ICONS.requirement}
              title="Defines the Goal"
              description=""
              color="#00E599"
              isExpanded={expandedItem === 'requirement'}
              onToggle={() => onToggleExpand('requirement')}
            />
            <MobileExpandableArtifactItem
              artifactType="model"
              icon={ARTIFACT_ICONS.model}
              title="Shapes the Data"
              description=""
              color="#00B8FF"
              isExpanded={expandedItem === 'model'}
              onToggle={() => onToggleExpand('model')}
            />
            <MobileExpandableArtifactItem
              artifactType="code"
              icon={ARTIFACT_ICONS.code}
              title="Details the Logic"
              description=""
              color="#ffffff"
              isExpanded={expandedItem === 'code'}
              onToggle={() => onToggleExpand('code')}
            />
            <MobileExpandableArtifactItem
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

      {/* Part 2: The Structure */}
      <section className="py-12 px-6 border-t border-gray-800">
        <div className="max-w-lg mx-auto">
          <MobileSectionDivider
            title="The Structure"
            subtitle="Architecting the System"
            color="#00B8FF"
            ringColor="#00B8FF"
            partNumber="Part 2"
          />
          
          <p className="text-gray-300 mb-8 text-center text-sm leading-relaxed">
            Features don't live in isolation. You need to define how they fit into the bigger picture. These artifacts build the architectural blueprint and model how components interact.
          </p>
          
          <div className="space-y-3">
            <MobileExpandableArtifactItem
              artifactType="design"
              icon={ARTIFACT_ICONS.design}
              title="The Components"
              description="Defines the high-level responsibilities of services"
              color="#00B8FF"
              isExpanded={expandedItem === 'design'}
              onToggle={() => onToggleExpand('design')}
            />
            <MobileExpandableArtifactItem
              artifactType="api"
              icon={ARTIFACT_ICONS.api}
              title="The Contracts"
              description="Specifies how components talk to each other"
              color="#3b82f6"
              isExpanded={expandedItem === 'api'}
              onToggle={() => onToggleExpand('api')}
            />
            <MobileExpandableArtifactItem
              artifactType="interaction"
              icon={ARTIFACT_ICONS.interaction}
              title="The Choreography"
              description="Models the sequence of communication between components"
              color="#06b6d4"
              isExpanded={expandedItem === 'interaction'}
              onToggle={() => onToggleExpand('interaction')}
            />
            <MobileExpandableArtifactItem
              artifactType="behavior"
              icon={ARTIFACT_ICONS.behavior}
              title="The Lifecycle"
              description="The internal state and transitions of complex components"
              color="#a855f7"
              isExpanded={expandedItem === 'behavior'}
              onToggle={() => onToggleExpand('behavior')}
            />
            <MobileExpandableArtifactItem
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

      {/* Part 3: The Governance */}
      <section className="py-12 px-6 border-t border-gray-800">
        <div className="max-w-lg mx-auto">
          <MobileSectionDivider
            title="The Governance"
            subtitle="Enforcing the Rules"
            color="#a855f7"
            ringColor="#a855f7"
            partNumber="Part 3"
          />
          
          <p className="text-gray-300 mb-8 text-center text-sm leading-relaxed">
            A robust system needs rules that apply everywhere. These artifacts allow you to define system-wide policies, terminology, and <i>most importantly</i> how the AI agent should behave. This is how you achieve consistency at scale.
          </p>
          
          <div className="space-y-3">
            <MobileExpandableArtifactItem
              artifactType="policy"
              icon={ARTIFACT_ICONS.policy}
              title="Enforcing System-Wide Rules"
              description="Centralizes rules for errors"
              color="#a855f7"
              isExpanded={expandedItem === 'policy'}
              onToggle={() => onToggleExpand('policy')}
            />
            <MobileExpandableArtifactItem
              artifactType="nfr"
              icon={ARTIFACT_ICONS.nfr}
              title="Defining Quality"
              description="Non-Functional Requirements as a formal part"
              color="#eab308"
              isExpanded={expandedItem === 'nfr'}
              onToggle={() => onToggleExpand('nfr')}
            />
            <MobileExpandableArtifactItem
              artifactType="infra"
              icon={ARTIFACT_ICONS.infra}
              title="The Environment"
              description="Specifies configuration and deployment details"
              color="#f97316"
              isExpanded={expandedItem === 'infra'}
              onToggle={() => onToggleExpand('infra')}
            />
            <MobileExpandableArtifactItem
              artifactType="glossary"
              icon={ARTIFACT_ICONS.glossary}
              title="The Dictionary"
              description="Creates a shared understanding of terms"
              color="#7dd3fc"
              isExpanded={expandedItem === 'glossary'}
              onToggle={() => onToggleExpand('glossary')}
            />
            <div className="relative">
              <MobileExpandableArtifactItem
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

      {/* Part 4: The Metrics */}
      <section className="py-12 px-6 border-t border-gray-800">
        <div className="max-w-lg mx-auto">
          <MobileSectionDivider
            title="The Metrics"
            subtitle="Measuring What Matters"
            color="#fbbf24"
            ringColor="#fbbf24"
            partNumber="Part 4"
          />
          
          <p className="text-gray-300 mb-8 text-center text-sm leading-relaxed">
            Business value is the ultimate test of any system. KPIs connect your technical architecture to business outcomes, enabling powerful what-if analysis and data-driven decision making.
          </p>
          
          <div className="space-y-3">
            <div className="relative">
              <MobileExpandableArtifactItem
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
              <h4 className="text-yellow-400 font-semibold mb-2 text-sm">✨ What-If Analysis</h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                Because the agent understands the link between <code className="text-green-400">requirements</code>, <code className="text-green-400">code</code>, and KPIs, it can run a virtual simulation to predict the future. This creates a feedback loop 
                between business strategy and technical implementation.
                <br/><br/>Before you write a line of code for a new feature, you can ask:
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