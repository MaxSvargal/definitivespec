'use client';

import React, { useState, useRef } from 'react';
import { ContentSections } from '../components/ContentSections';
import { DDMVisualization } from '../components/DDMVisualization';
import { PencilSimple, ShieldCheck, Gear, Repeat, Lock, Terminal, UserGear, DiscordLogo, GithubLogo, Download, BookOpen, FlowArrow } from 'phosphor-react';
import SocialButton from '@/components/SocialButton';

// Main component
export default function DDM2Page() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentScene, setCurrentScene] = useState(0);

  const handleSceneChange = (scene: number) => {
    setCurrentScene(scene);
  };

  return (
    <div ref={containerRef} className="bg-gray-950 text-white">
      <div className="flex">
        <div className="w-3/5 h-screen sticky top-0 self-start">
          <DDMVisualization onSceneChange={handleSceneChange} />
        </div>

        <div className="w-2/5 bg-[#03070e]">
          <ContentSections currentScene={currentScene} />
        </div>
      </div>

      {/* Section 6: The Cycle of Certainty */}
      <div className="w-full bg-[#03070e] border-t border-gray-900 min-h-[80vh]">
        <div className="container mx-auto px-8 py-32">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-8 text-yellow-500 uppercase tracking-tighter">
            <p className='leading-[.8em]'>
              <span className="text-4xl leading-[.1em]">The Cycle of Certainty: </span>
            </p>
            <p className="text-gray-200 text-6xl leading-[.8em] max-w-3xl mx-auto">Operating System <br/><span className='text-7xl leading-[.8em]'>for Development</span></p>
          </h2>
            <p className="text-xl text-gray-300 mb-8 mt-16 max-w-4xl mx-auto leading-relaxed">
              DefinitiveSpec isn't just a set of files; it's a rigorous, iterative process. <br/>
              This closed-loop system ensures that every piece of specification is traceable <br/>
              to a validated requirement, eliminating drift and ambiguity.
            </p>
          </div>

          {/* DDM Lifecycle Steps */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {/* Stage 1 & 2: Define & Specify */}
            <div className="bg-gray-950/50 border border-gray-700/50 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-neon-green/20 rounded-full flex items-center justify-center">
                  <PencilSimple size={20} weight="bold" className="text-neon-green" />
                </div>
                <h3 className="text-lg font-bold text-neon-green">Define & Specify</h3>
              </div>
              <h4 className="text-sm font-semibold text-white mb-2">From an Idea to a Blueprint</h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                You begin by capturing business intent as a <code className="text-neon-green bg-gray-800 px-1 py-0.5 rounded text-xs">requirement</code> and 
                defining success with a <code className="text-neon-green bg-gray-800 px-1 py-0.5 rounded text-xs">kpi</code>. Then, you create the 
                architectural blueprint: the <code className="text-neon-green bg-gray-800 px-1 py-0.5 rounded text-xs">models</code>, 
                <code className="text-neon-green bg-gray-800 px-1 py-0.5 rounded text-xs">apis</code>, and 
                abstract <code className="text-neon-green bg-gray-800 px-1 py-0.5 rounded text-xs">code</code> logic. 
                This is the single source of truth.
              </p>
            </div>

            {/* Stage 3: Validate & Simulate */}
            <div className="bg-gray-950/50 border border-gray-700/50 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-neon-blue/20 rounded-full flex items-center justify-center">
                  <ShieldCheck size={20} weight="bold" className="text-neon-blue" />
                </div>
                <h3 className="text-lg font-bold text-neon-blue">Validate & Simulate</h3>
              </div>
              <h4 className="text-sm font-semibold text-white mb-2">Find Flaws Before You Code</h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                This is our crucial pre-flight check. The agent validates every spec for correctness and integrity. 
                Here, you can run "What-If" analyses on KPIs or simulate complex 
                <code className="text-neon-blue bg-gray-800 px-1 py-0.5 rounded text-xs">interactions</code> to prove your design 
                is sound <em>before</em> committing to implementation.
              </p>
            </div>

            {/* Stage 4: Generate & Verify */}
            <div className="bg-gray-950/50 border border-gray-700/50 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-400/20 rounded-full flex items-center justify-center">
                  <Gear size={20} weight="bold" className="text-purple-400" />
                </div>
                <h3 className="text-lg font-bold text-purple-400">Generate & Verify</h3>
              </div>
              <h4 className="text-sm font-semibold text-white mb-2">Automated, Consistent Implementation</h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                With a validated blueprint, the agent acts as an automated builder. It translates your 
                <code className="text-purple-400 bg-gray-800 px-1 py-0.5 rounded text-xs">code</code> specs into production-ready code, 
                strictly adhering to the <code className="text-purple-400 bg-gray-800 px-1 py-0.5 rounded text-xs">directive</code> patterns 
                your team has defined.
              </p>
            </div>

            {/* The Feedback Loop */}
            <div className="bg-gradient-to-br from-yellow-500/20 to-gray-950/10 border border-yellow-500/30 rounded-lg p-6 relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-purple-400 rounded-full flex items-center justify-center">
                    <Repeat size={20} weight="bold" className="text-black" />
                  </div>
                  <h3 className="text-lg font-bold text-yellow-500">The Feedback Loop</h3>
                </div>
                <h4 className="text-sm font-semibold text-white mb-2">The Golden Rule of DefinitiveSpec</h4>
                <p className="text-gray-300 text-sm leading-relaxed mb-3">
                  <strong className="text-yellow-500">The Spec is Truth. Always.</strong> If testing or a new insight reveals a flaw, 
                  you don't patch the code. You update the <em>specification</em>. This triggers the cycle again, ensuring your 
                  documentation and implementation are never out of sync.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 7: The Disciplined Agent */}
      <div className="w-full bg-[#03070e] border-t border-gray-800">
        <div className="container mx-auto px-8 pt-40 pb-24">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-8 text-[#f97316] uppercase tracking-tighter">
            <p className='leading-[.8em]'>
              <span className="text-[4.5rem] leading-[.1em]">Not a Chatbot</span>
            </p>
            <p className="text-gray-200 mx-auto">
              
              <span className='text-[6rem] leading-[.8em]'>A Compiler </span><br/>
              <span className='text-[3.64rem] leading-[.5em]'>for Specifications</span>
            </p>
          </h2>
            <p className="text-xl text-gray-300 mb-8 mt-16 max-w-4xl mx-auto leading-relaxed">
              Our agent is not a creative co-pilot; it's a <strong className="text-[#f97316]">disciplined executor</strong>. 
              <br/>It's a new kind of tool — a computer within an LLM, that takes natural language requirements and raw ideas as input and produces precise specifications as output. 
              <br/>You ready to start writing high-quality code.
            </p>
          </div>

          {/* Three Pillars of Trust */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {/* Pillar 1: Bound by Protocol */}
            <div className="bg-gray-950/50 border border-gray-700/50 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#7dd3fc20' }}>
                  <Lock size={20} weight="bold" style={{ color: '#7dd3fc' }} />
                </div>
                <h3 className="text-lg font-bold" style={{ color: '#7dd3fc' }}>Bound by Protocol</h3>
              </div>
              <h4 className="text-sm font-semibold text-white mb-2">Strict, Non-Negotiable Rules</h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                <strong className="text-white">The agent follows strict, non-negotiable rules.</strong> The 
                <code className="bg-gray-800 px-1 py-0.5 rounded text-xs" style={{ color: '#7dd3fc' }}>DDM-RULE-XXX</code> protocol, like 
                <code className="bg-gray-800 px-1 py-0.5 rounded text-xs" style={{ color: '#7dd3fc' }}>DDM-RULE-001: SpecIsTruth</code>, 
                is hard-coded into its operation. It cannot add logic that isn't in the spec. It cannot ignore a policy. 
                This ensures its behavior is predictable and aligned with your standards.
              </p>
            </div>

            {/* Pillar 2: A Formal Command Interface */}
            <div className="bg-gray-950/50 border border-gray-700/50 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#06b6d420' }}>
                  <Terminal size={20} weight="bold" style={{ color: '#06b6d4' }} />
                </div>
                <h3 className="text-lg font-bold" style={{ color: '#06b6d4' }}>A Formal Command Interface</h3>
              </div>
              <h4 className="text-sm font-semibold text-white mb-2">Clear Commands, Not Conversation</h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                <strong className="text-white">You interact with the agent like any other developer tool.</strong> It responds to clear commands, 
                not vague conversation. You issue tasks like <code className="bg-gray-800 px-1 py-0.5 rounded text-xs" style={{ color: '#06b6d4' }}>DSpec: Implement Code Spec</code> or 
                <code className="bg-gray-800 px-1 py-0.5 rounded text-xs" style={{ color: '#06b6d4' }}>DSpec: Run Simulation</code>. It requires specific inputs 
                (the <code className="bg-gray-800 px-1 py-0.5 rounded text-xs" style={{ color: '#06b6d4' }}>.dspec</code> files) and produces structured outputs 
                (code, analysis reports). It has an API, not a personality.
              </p>
            </div>

            {/* Pillar 3: Human-Governed & Verifiable */}
            <div className="bg-gray-950/50 border border-gray-700/50 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#00B8FF20' }}>
                  <UserGear size={20} weight="bold" style={{ color: '#00B8FF' }} />
                </div>
                <h3 className="text-lg font-bold" style={{ color: '#00B8FF' }}>Human-Governed & Verifiable</h3>
              </div>
              <h4 className="text-sm font-semibold text-white mb-2">You Program the Agent</h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                The 
                <code className="bg-gray-800 px-1 py-0.5 rounded text-xs" style={{ color: '#00B8FF' }}>directive</code> patterns that translate specs into code 
                are your team's "cookbook." They are managed by your architects and governed by a formal process. We are so serious about this 
                that we even have <code className="bg-gray-800 px-1 py-0.5 rounded text-xs" style={{ color: '#00B8FF' }}>test</code> specs 
                <em> for the agent itself</em>, ensuring it complies with its own rules.
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-[20vh]">
            {/* Action Buttons */}
            <div className="mt-16 flex justify-center items-center gap-4 flex-wrap">
                <SocialButton
                  size="large"
                  Icon={Download}
                  name="Download"
                  href="https://github.com/ArchitectLM/DDM/blob/main/dspec_agent_context.md"
                  colors={{
                    main: '#f97316',
                    before: '#ea580c',
                    after: '#fb923c'
                  }}
                />
                <SocialButton
                  size="large"
                  Icon={BookOpen}
                  name="Agent Manual"
                  href="https://github.com/ArchitectLM/DDM/blob/main/agent_guid.md"
                  colors={{
                    main: '#06b6d4',
                    before: '#0891b2',
                    after: '#22d3ee'
                  }}
                />
                <SocialButton
                  size="large"
                  Icon={FlowArrow}
                  name="Methodology"
                  href="https://github.com/ArchitectLM/DDM/blob/main/methodology_guide.md"
                  colors={{
                    main: '#8b5cf6',
                    before: '#7c3aed',
                    after: '#a78bfa'
                  }}
                />
                <SocialButton
                  size="large"
                  Icon={DiscordLogo}
                  name="Discord"
                  href="https://discord.gg/Bs6UdvWF"
                  colors={{
                    main: '#5865F2',
                    before: '#4752C4',
                    after: '#7983F5'
                  }}
                />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
