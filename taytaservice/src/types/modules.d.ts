// Para módulos que no tienen tipos

declare module 'react-dropzone' {
  import { CSSProperties, ReactNode, DragEvent, ChangeEvent } from 'react';

  interface FileRejection {
    file: File;
    errors: {
      code: string;
      message: string;
    }[];
  }

  interface DropzoneOptions {
    accept?: Record<string, string[]>;
    minSize?: number;
    maxSize?: number;
    maxFiles?: number;
    preventDropOnDocument?: boolean;
    noClick?: boolean;
    noKeyboard?: boolean;
    noDrag?: boolean;
    noDragEventsBubbling?: boolean;
    disabled?: boolean;
    onDrop?: <T extends File>(
      acceptedFiles: T[],
      fileRejections: FileRejection[],
      event: DragEvent<HTMLElement> | ChangeEvent<HTMLInputElement>
    ) => void;
    onDropAccepted?: <T extends File>(
      files: T[],
      event: DragEvent<HTMLElement> | ChangeEvent<HTMLInputElement>
    ) => void;
    onDropRejected?: (
      fileRejections: FileRejection[],
      event: DragEvent<HTMLElement> | ChangeEvent<HTMLInputElement>
    ) => void;
    getFilesFromEvent?: (
      event: DragEvent<HTMLElement> | ChangeEvent<HTMLInputElement>
    ) => Promise<Array<File | DataTransferItem>>;
    onFileDialogCancel?: () => void;
    onFileDialogOpen?: () => void;
    onError?: (err: Error) => void;
    validator?: <T extends File>(file: T) => { code: string; message: string } | null;
    useFsAccessApi?: boolean;
  }

  interface DropzoneState {
    acceptedFiles: File[];
    fileRejections: FileRejection[];
    isFocused: boolean;
    isDragActive: boolean;
    isDragAccept: boolean;
    isDragReject: boolean;
    isFileDialogActive: boolean;
    getRootProps: (props?: {
      refKey?: string;
      [key: string]: any;
    }) => {
      ref: (node: HTMLElement | null) => void;
      className: string;
      style: CSSProperties;
      [key: string]: any;
    };
    getInputProps: (props?: {
      [key: string]: any;
    }) => {
      type: string;
      accept: string;
      style: CSSProperties;
      multiple: boolean;
      [key: string]: any;
    };
    rootRef: React.RefObject<HTMLElement>;
    inputRef: React.RefObject<HTMLInputElement>;
    open: () => void;
  }

  function useDropzone(options?: DropzoneOptions): DropzoneState;

  const Dropzone: React.FC<DropzoneOptions & { children?: ReactNode }>;

  export default Dropzone;
  export { useDropzone };
}

// Para archivos SVG
declare module '*.svg' {
  import React = require('react');
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

// Para archivos de imagen
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.webp';

// Para archivos de estilos
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.sass' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.less' {
  const classes: { [key: string]: string };
  export default classes;
}
