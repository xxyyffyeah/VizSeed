import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';

interface SpecEditorProps {
  spec: any;
  onChange: (spec: any) => void;
}

export const SpecEditor: React.FC<SpecEditorProps> = ({ spec, onChange }) => {
  const [specCode, setSpecCode] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (spec) {
      setSpecCode(JSON.stringify(spec, null, 2));
    }
  }, [spec]);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setSpecCode(value);
      
      try {
        const parsedSpec = JSON.parse(value);
        onChange(parsedSpec);
        setError(null);
      } catch (err) {
        setError('JSON 格式错误');
      }
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(specCode);
      // TODO: 添加复制成功提示
      console.log('复制成功');
    } catch (err) {
      console.error('复制失败:', err);
      // 提示用户手动复制
      alert('复制失败，请手动选择文本复制');
    }
  };

  return (
    <div className="spec-editor-container">
      <div className="spec-editor-header">
        <h3>🔧 图表规范编辑器</h3>
        <button 
          className="copy-btn"
          onClick={copyToClipboard}
          title="复制规范到剪贴板"
        >
          📋 复制
        </button>
      </div>
      
      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}
      
      <div className="spec-editor-wrapper">
        <Editor
          height="400px"
          defaultLanguage="json"
          value={specCode}
          onChange={handleEditorChange}
          options={{
            minimap: { enabled: false },
            fontSize: 12,
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
      
      <div className="spec-editor-footer">
        <span className="hint">💡 编辑JSON规范会实时更新图表</span>
      </div>
    </div>
  );
};