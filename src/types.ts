import { Accessor, JSX } from "solid-js"

/**
 * @property `source` - DOMString containing a URL representing the object given in the parameter
 */
export type UploadFile = {
  source: string
  name: string
  size: number
  file: File
}

export interface Dropzone<T extends HTMLElement = HTMLElement> {
  setRef: (ref: T) => void
  files: Accessor<UploadFile[]>
  isDragging: Accessor<boolean>
  removeFile: (fileName: string) => void
  clearFiles: () => void
}

export type UserCallback = (files: UploadFile[]) => void | Promise<void>

/**
 * @property `accept` - Comma-separated list of one or more file types, or unique file type specifiers
 * @link `accept` - https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/accept
 */
export interface DropzoneOptions {
  onDrop?: UserCallback
  onDragStart?: UserCallback
  onDragEnter?: UserCallback
  onDragEnd?: UserCallback
  onDragLeave?: UserCallback
  onDragOver?: UserCallback
  onDrag?: UserCallback
}

export type FileErrors = {
  [key: string]: {
    error: string
    file?: UploadFile
  }
}

export interface GetRootPropsOptions<T extends HTMLElement> extends JSX.HTMLAttributes<T> {
  refKey?: string
}

export interface GetInputPropsOptions extends JSX.HTMLAttributes<HTMLInputElement> {
  refKey?: string
}

/**
 * @property `disabled` - Disable the dropzone
 * @property `maxSize` - Maximum file size in bytes
 * @property `minSize` - Minimum file size in bytes
 * @property `multiple` - Allow multiple files
 * @property `maxFiles` - Maximum number of files
 * @property `accept` - Comma-separated list of one or more file types, or unique file type specifiers
 * @link `accept` - https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/accept
 * @property `noClick` - Disable click to open file dialog
 * @property `noKeyboard` - Disable keyboard navigation
 * @property `noDrag` - Disable drag'n'drop
 * @property `validator` - Custom file validation function, overrides default validation
 */
export type CreateDropzoneOptions = {
  disabled?: boolean
  maxSize?: number
  minSize?: number
  multiple?: boolean
  maxFiles?: number
  accept?: string[]
  noClick?: boolean
  noKeyboard?: boolean
  noDrag?: boolean
  validator?: (file: UploadFile, files: UploadFile[]) => boolean
}

/**
 * @property `isFocused` - Whether the dropzone is focused
 * @property `isFileDialogActive` - Whether the file dialog is open
 * @property `isDragging` - Whether the dropzone is being dragged over
 * @property `getRootProps` - Props to be spread onto the dropzone element
 * @property `getInputProps` - Props to be spread onto the hidden file input element
 * @property `openFileDialog` - Open the file dialog programmatically
 * @property `setRefs` - Set the dropzone and file input references
 * @property `files` - Array of files
 * @property `errors` - Object of errors
 * @property `removeFile` - Remove a file by name
 * @property `clearFiles` - Remove all files
 */
export type CreateDropzone<T extends HTMLElement> = {
  isFocused: Accessor<boolean>
  isFileDialogActive: Accessor<boolean>
  isDragging: Accessor<boolean>
  getRootProps: (options?: GetRootPropsOptions<T>) => JSX.HTMLAttributes<T>
  getInputProps: (options?: GetInputPropsOptions) => JSX.HTMLAttributes<HTMLInputElement>
  openFileDialog: () => void
  setRefs: (r: T, i: HTMLInputElement) => void
  files: Accessor<UploadFile[]>
  errors: Accessor<FileErrors>
  removeFile: (fileName: string) => void
  removeError: (fileName: string) => void
  clearFiles: () => void
}
