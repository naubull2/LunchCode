// Type declarations for monaco-vim and monaco-emacs modules
declare module 'monaco-vim' {
  import { editor } from 'monaco-editor';
  
  export function initVimMode(editor: editor.IStandaloneCodeEditor, statusBarElement: HTMLElement): {
    dispose: () => void;
  };
}

declare module 'monaco-emacs' {
  import { editor } from 'monaco-editor';
  
  export function initEmacsMode(editor: editor.IStandaloneCodeEditor): {
    dispose: () => void;
  };
}
