import React, { useEffect, useRef } from 'react';
import Editor, { OnMount, Monaco } from '@monaco-editor/react';
import { editor } from 'monaco-editor';
import { useTheme } from '../../utils/ThemeContext';
import { KeyMapping } from '../../utils/KeyMappingContext';
import './editorKeyMapping.css';

interface CodeEditorProps {
  language: string;
  value: string;
  keyMapping: KeyMapping;
  onChange: (value: string | undefined) => void;
  onLanguageChange: (language: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  language,
  value,
  keyMapping,
  onChange,
  onLanguageChange,
}) => {
  const { theme } = useTheme();
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const keymappingRef = useRef<any>(null);

  const applyKeyMapping = async (mapping: KeyMapping) => {
    if (keymappingRef.current) {
      keymappingRef.current.dispose();
      keymappingRef.current = null;
    }

    if (!editorRef.current) return;

    try {
      if (mapping === 'vim') {
        const { initVimMode } = await import('monaco-vim');
        let statusBar = document.getElementById('vim-status-bar');
        if (!statusBar) {
          statusBar = document.createElement('div');
          statusBar.id = 'vim-status-bar';
          statusBar.className = 'vim-status-bar';
          editorRef.current.getDomNode()?.parentElement?.appendChild(statusBar);
        }
        keymappingRef.current = initVimMode(editorRef.current, statusBar);
      } else if (mapping === 'emacs') {
        const { initEmacsMode } = await import('monaco-emacs');
        keymappingRef.current = initEmacsMode(editorRef.current);
      }
    } catch (error) {
      console.error('Error applying keymapping:', error);
    }
  };

  useEffect(() => {
    if (editorRef.current) {
      applyKeyMapping(keyMapping);
    }
  }, [keyMapping]);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    editor.focus();
    if (keyMapping !== 'default') {
      applyKeyMapping(keyMapping);
    }
  };

  const supportedLanguages = [
    { id: 'javascript', name: 'JavaScript' },
    { id: 'python', name: 'Python' },
    { id: 'java', name: 'Java' },
    { id: 'cpp', name: 'C++' },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className={`flex items-center justify-between p-2 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <div>
          <select 
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            className={`px-2 py-1 rounded text-sm ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-800 border border-gray-300'}`}>
            {supportedLanguages.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex-grow">
        <Editor
          height="100%"
          language={language}
          value={value}
          theme={theme === 'dark' ? 'vs-dark' : 'light'}
          onMount={handleEditorDidMount}
          onChange={onChange}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
