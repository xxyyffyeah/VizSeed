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
    
    // 配置TypeScript编译选项
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      noEmit: true,
      esModuleInterop: true,
      jsx: monaco.languages.typescript.JsxEmit.React,
      reactNamespace: 'React',
      allowJs: true,
      typeRoots: ['node_modules/@types']
    });

    // 添加VizSeed类型定义
    const vizSeedTypeDefinitions = `
declare module 'vizseed' {
  export class VizSeedBuilder {
    constructor(data: any[]);
    setChartType(type: 'bar' | 'column' | 'line' | 'area' | 'scatter' | 'pie' | 'table'): VizSeedBuilder;
    setDimensions(dimensions: string[]): VizSeedBuilder;
    setMeasures(measures: string[]): VizSeedBuilder;
    addDimension(dimension: string): VizSeedBuilder;
    addMeasure(measure: string): VizSeedBuilder;
    build(): Promise<any>;
    buildSpec(library?: 'vchart' | 'echarts' | 'vtable'): Promise<any>;
    getSupportedLibraries(): string[];
    getAllSupportedChartTypes(): Record<string, string[]>;
  }
}
`;

    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      vizSeedTypeDefinitions,
      'file:///node_modules/@types/vizseed/index.d.ts'
    );

    // 配置自动补全
    const completionProvider = monaco.languages.registerCompletionItemProvider('typescript', {
      provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn
        };

        const suggestions: monaco.languages.CompletionItem[] = [
          {
            label: 'VizSeedBuilder',
            kind: monaco.languages.CompletionItemKind.Class,
            insertText: 'VizSeedBuilder',
            range: range,
            documentation: 'VizSeed构建器类'
          },
          {
            label: 'setChartType',
            kind: monaco.languages.CompletionItemKind.Method,
            insertText: "setChartType('${1:bar}')",
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: range,
            documentation: '设置图表类型'
          },
          {
            label: 'setDimensions',
            kind: monaco.languages.CompletionItemKind.Method,
            insertText: "setDimensions([${1:'dimension'}])",
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: range,
            documentation: '设置维度字段'
          },
          {
            label: 'setMeasures',
            kind: monaco.languages.CompletionItemKind.Method,
            insertText: "setMeasures([${1:'measure'}])",
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: range,
            documentation: '设置度量字段'
          },
          {
            label: 'buildSpec',
            kind: monaco.languages.CompletionItemKind.Method,
            insertText: "buildSpec('${1:vchart}')",
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: range,
            documentation: '构建图表规范'
          }
        ];

        return { suggestions };
      }
    });

    // 添加快捷键
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      handleExecute();
    });

    return () => {
      completionProvider.dispose();
    };
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
          defaultLanguage="typescript"
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
            suggestOnTriggerCharacters: true,
            acceptSuggestionOnCommitCharacter: true,
            acceptSuggestionOnEnter: 'on',
            snippetSuggestions: 'top',
            wordBasedSuggestions: 'allDocuments',
            parameterHints: { enabled: true },
            quickSuggestions: {
              other: true,
              comments: false,
              strings: false
            }
          }}
        />
      </div>
      
      <div className="editor-footer">
        <span className="hint">💡 按 Ctrl+Enter 执行代码 | 支持TypeScript智能提示</span>
      </div>
    </div>
  );
};