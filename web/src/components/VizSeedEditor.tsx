import React, { useRef } from 'react';
import Editor from '@monaco-editor/react';
import * as monaco from 'monaco-editor';

interface VizSeedEditorProps {
  code: string;
  onChange: (code: string) => void;
  onExecute: (code: string) => void;
  isLoading: boolean;
}

export const VizSeedEditor: React.FC<VizSeedEditorProps> = ({
  code,
  onChange,
  onExecute,
  isLoading
}) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor, monaco: typeof import('monaco-editor')) => {
    editorRef.current = editor;
    
    // JSON语言不需要特殊配置，Monaco自带JSON支持和语法高亮
    
    // 添加快捷键
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      handleExecute();
    });
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      onChange(value);
    }
  };

  const handleExecute = () => {
    onExecute(code);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleExecute();
    }
  };

  return (
    <div className="editor-container">
      <div className="editor-header">
        <h3>📝 VizSeed DSL 编辑器</h3>
        <button 
          className="execute-btn"
          onClick={handleExecute}
          disabled={isLoading}
        >
          {isLoading ? '⏳ 执行中...' : '▶️ 执行 (Ctrl+Enter)'}
        </button>
      </div>
      
      <div className="editor-wrapper" onKeyDown={handleKeyDown}>
        <Editor
          height="400px"
          defaultLanguage="json"
          value={code}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
            theme: 'vs-dark',
            formatOnPaste: true,
            formatOnType: true
          }}
        />
      </div>
      
      <div className="editor-footer">
        <span className="hint">💡 按 Ctrl+Enter 执行VizSeed DSL | JSON格式编辑</span>
      </div>
    </div>
  );
};