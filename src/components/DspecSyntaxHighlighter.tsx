import React from 'react';

interface DspecSyntaxHighlighterProps {
  code: string;
}

export const DspecSyntaxHighlighter: React.FC<DspecSyntaxHighlighterProps> = ({ code }) => {
  const lines = code.split('\n');
  
  const parseTokens = (text: string): React.ReactNode[] => {
    const tokens: React.ReactNode[] = [];
    
    // Keywords (artifact types, reserved words) - using page color scheme
    const keywords = [
      'requirement', 'model', 'code', 'test', 'design', 'api', 'interaction', 
      'behavior', 'event', 'policy', 'nfr', 'infra', 'glossary', 'directive', 'kpi',
      'fsm', 'initial', 'state', 'transition', 'from', 'to', 'event', 'template',
      'pattern', 'implements_api', 'verifies_code', 'applies_to', 'target_tool',
      'detailed_behavior', 'expected_result', 'metric_formula', 'target',
      'responsibilities', 'dependencies', 'components', 'step', 'action', 'next_step',
      'payload_model', 'error_catalog', 'define', 'statement', 'configuration',
      'term', 'definition', 'title', 'rationale', 'description', 'path', 'method',
      'request_model', 'format', 'required', 'minLength', 'sensitive', 'default'
    ];
    
    // Regex patterns
    const keywordPattern = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
    const stringPattern = /"([^"\\]|\\.)*"/g;
    const commentPattern = /\/\/.*$/g;
    const operatorPattern = /[{}[\]()]/g; // Removed ; and ,
    const templatePattern = /\{\{[^}]+\}\}/g;
    
    // Find all matches
    const matches: Array<{start: number, end: number, type: string, content: string}> = [];
    
    // Keywords
    let match;
    while ((match = keywordPattern.exec(text)) !== null) {
      matches.push({
        start: match.index,
        end: match.index + match[0].length,
        type: 'keyword',
        content: match[0]
      });
    }
    
    // Strings
    keywordPattern.lastIndex = 0;
    while ((match = stringPattern.exec(text)) !== null) {
      matches.push({
        start: match.index,
        end: match.index + match[0].length,
        type: 'string',
        content: match[0]
      });
    }
    
    // Comments
    stringPattern.lastIndex = 0;
    while ((match = commentPattern.exec(text)) !== null) {
      matches.push({
        start: match.index,
        end: match.index + match[0].length,
        type: 'comment',
        content: match[0]
      });
    }
    
    // Template variables
    commentPattern.lastIndex = 0;
    while ((match = templatePattern.exec(text)) !== null) {
      matches.push({
        start: match.index,
        end: match.index + match[0].length,
        type: 'template',
        content: match[0]
      });
    }
    
    // Operators (brackets only, less bright)
    templatePattern.lastIndex = 0;
    while ((match = operatorPattern.exec(text)) !== null) {
      matches.push({
        start: match.index,
        end: match.index + match[0].length,
        type: 'operator',
        content: match[0]
      });
    }
    
    // Sort matches by start position
    matches.sort((a, b) => a.start - b.start);
    
    // Remove overlapping matches (keep the first one)
    const filteredMatches = matches.filter((match, index) => {
      if (index === 0) return true;
      return match.start >= matches[index - 1].end;
    });
    
    // Build tokens
    let lastEnd = 0;
    filteredMatches.forEach((match, index) => {
      // Add text before match
      if (match.start > lastEnd) {
        const beforeText = text.slice(lastEnd, match.start);
        if (beforeText) {
          tokens.push(
            <span key={`text-${index}-${lastEnd}`} className="text-white">
              {beforeText}
            </span>
          );
        }
      }
      
      // Add highlighted match using page color scheme
      const className = {
        keyword: 'text-neon-green font-medium', // Using neon green from page
        string: 'text-white',
        comment: 'text-gray-500 italic',
        template: 'text-neon-blue', // Using neon blue from page
        operator: 'text-gray-500' // Less bright brackets
      }[match.type] || 'text-white';
      
      tokens.push(
        <span key={`${match.type}-${index}`} className={className}>
          {match.content}
        </span>
      );
      
      lastEnd = match.end;
    });
    
    // Add remaining text
    if (lastEnd < text.length) {
      tokens.push(
        <span key={`text-end-${lastEnd}`} className="text-white">
          {text.slice(lastEnd)}
        </span>
      );
    }
    
    return tokens;
  };

  return (
    <div className="text-xs overflow-x-auto font-mono">
      {lines.map((line, lineIndex) => {
        if (!line.trim()) {
          return <div key={lineIndex} className="h-4"></div>;
        }

        // Calculate indentation level for spacing only
        const indent = Math.min(Math.floor((line.length - line.trimStart().length) / 4), 2);
        const trimmedLine = line.trim();

        // Check if line is a key-value pair
        const keyMatch = trimmedLine.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*:/);
        const isKeyLine = keyMatch !== null;
        
        return (
          <div 
            key={lineIndex} 
            className="py-1 leading-relaxed"
            style={{ marginLeft: `${indent * 16}px` }}
          >
            {isKeyLine ? (
              <div>
                <span className="text-gray-400">{keyMatch[1]}</span>
                <span className="text-gray-500">:</span>
                <span className="ml-1">
                  {parseTokens(trimmedLine.slice(keyMatch[0].length))}
                </span>
              </div>
            ) : (
              <div>{parseTokens(trimmedLine)}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}; 