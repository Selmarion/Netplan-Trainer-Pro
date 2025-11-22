import React from 'react';

interface CodeEditorProps {
  code: string;
  onChange: (val: string) => void;
  disabled: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ code, onChange, disabled }) => {
  const lines = code.split('\n').length;

  return (
    <div className="relative flex h-full font-mono text-sm bg-[#1e293b] rounded-b-lg overflow-hidden">
      {/* Line Numbers */}
      <div className="bg-[#0f172a] text-slate-500 p-4 text-right select-none border-r border-slate-700 min-w-[3rem]">
        {Array.from({ length: Math.max(10, lines) }).map((_, i) => (
          <div key={i} className="leading-6">{i + 1}</div>
        ))}
      </div>

      {/* Text Area */}
      <textarea
        value={code}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        spellCheck={false}
        className="w-full h-full bg-[#1e293b] text-slate-200 p-4 leading-6 resize-none focus:outline-none"
        style={{ tabSize: 2 }}
      />
    </div>
  );
};