import React, { useState, useEffect, useRef } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import { editor } from 'monaco-editor';
// We need to import these dynamically since they have browser-specific code
// that shouldn't run during server-side rendering
import { useTheme } from '../../utils/ThemeContext';
import './editorKeyMapping.css';

// Define available keymappings
type KeyMapping = 'default' | 'vim' | 'emacs';

interface CodeEditorProps {
  defaultLanguage?: string;
  defaultValue?: string;
  onChange?: (value: string | undefined) => void;
  onLanguageChange?: (language: string) => void;
  onKeyMappingChange?: (keyMapping: KeyMapping) => void;
  language?: string;
  value?: string;
  keyMapping?: KeyMapping;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  defaultLanguage = 'javascript',
  defaultValue = '',
  onChange,
  onLanguageChange,
  onKeyMappingChange,
  language: propLanguage,
  value: propValue,
  keyMapping: propKeyMapping = 'default'
}) => {
  const { theme } = useTheme();
  const [language, setLanguage] = useState(propLanguage || defaultLanguage);
  const [editorValue, setEditorValue] = useState(propValue || defaultValue);
  const [keyMapping, setKeyMapping] = useState<KeyMapping>(propKeyMapping);
  
  // References for the editor and keymapping instances
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const keymappingRef = useRef<any>(null);
  
  // Update language when prop changes
  useEffect(() => {
    if (propLanguage && propLanguage !== language) {
      setLanguage(propLanguage);
    }
  }, [propLanguage, language]);

  // Update value when prop changes
  useEffect(() => {
    if (propValue !== undefined) {
      setEditorValue(propValue);
    }
  }, [propValue]);
  
  // Update keymapping when prop changes
  useEffect(() => {
    if (propKeyMapping !== keyMapping) {
      setKeyMapping(propKeyMapping);
      applyKeyMapping(propKeyMapping);
    }
  }, [propKeyMapping]);
  
  // Apply the selected keymapping
  const applyKeyMapping = async (mapping: KeyMapping) => {
    // Cleanup previous keymapping if it exists
    if (keymappingRef.current) {
      keymappingRef.current.dispose();
      keymappingRef.current = null;
    }
    
    if (!editorRef.current || !monacoRef.current) {
      return;
    }
    
    try {
      if (mapping === 'vim') {
        const { initVimMode } = await import('monaco-vim');
        // Create a DOM element for the vim status bar
        let statusNode = document.getElementById('vim-status-bar');
        if (!statusNode) {
          statusNode = document.createElement('div');
          statusNode.id = 'vim-status-bar';
          statusNode.className = 'vim-status-bar';
          editorRef.current.getDomNode()?.parentElement?.appendChild(statusNode);
        }
        keymappingRef.current = initVimMode(editorRef.current, statusNode);
      } 
      else if (mapping === 'emacs') {
        const { initEmacsMode } = await import('monaco-emacs');
        keymappingRef.current = initEmacsMode(editorRef.current);
      }
    } catch (error) {
      console.error('Error applying keymapping:', error);
    }
  };
  
  const supportedLanguages = [
    { id: 'javascript', name: 'JavaScript' },
    { id: 'python', name: 'Python' },
    { id: 'java', name: 'Java' },
    { id: 'cpp', name: 'C++' }
  ];

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setEditorValue(value);
      if (onChange) {
        onChange(value);
      }
    }
  };

  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    editor.focus();
    
    // Apply the initial keymapping if it's not default
    if (keyMapping !== 'default') {
      applyKeyMapping(keyMapping);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className={`flex items-center justify-between p-2 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <div>
          <select 
            value={language}
            onChange={(e) => {
              const newLanguage = e.target.value;
              setLanguage(newLanguage);
              if (onLanguageChange) {
                onLanguageChange(newLanguage);
              }
            }}
            className={`px-2 py-1 rounded text-sm ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'}`}
          >
            {supportedLanguages.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <select
            value={keyMapping}
            onChange={(e) => {
              const newKeyMapping = e.target.value as KeyMapping;
              setKeyMapping(newKeyMapping);
              applyKeyMapping(newKeyMapping);
              if (onKeyMappingChange) {
                onKeyMappingChange(newKeyMapping);
              }
            }}
            className={`px-2 py-1 ml-2 rounded text-sm ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'}`}
          >
            <option value="default">Default</option>
            <option value="vim">Vim</option>
            <option value="emacs">Emacs</option>
          </select>
        </div>
      </div>
      <div className="flex-grow">
        <Editor
          height="100%"
          language={language}
          value={editorValue}
          theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
