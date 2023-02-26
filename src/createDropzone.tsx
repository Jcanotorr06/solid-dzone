import { createSignal, JSX } from "solid-js"
import { isServer } from "solid-js/web"
import { parseAccept, transformFiles, validateFiles, defaultProps } from "./helpers"
import type {
  UploadFile,
  CreateDropzone,
  CreateDropzoneOptions,
  GetInputPropsOptions,
  GetRootPropsOptions,
  FileErrors,
} from "./types"

const createDropzone = <T extends HTMLElement = HTMLElement>(
  props: CreateDropzoneOptions = defaultProps,
): CreateDropzone<T> => {
  const {
    disabled,
    multiple,
    accept,
    maxFiles,
    maxSize,
    minSize,
    noClick,
    noDrag,
    noKeyboard,
    validator,
  } = props

  if (isServer) {
    return {
      isFocused: () => false,
      isFileDialogActive: () => false,
      isDragging: () => false,
      getRootProps: () => ({}),
      getInputProps: () => ({}),
      openFileDialog: () => {},
      setRefs: () => {},
      files: () => [],
      errors: () => ({}),
      removeFile: () => {},
      removeError: () => {},
      clearFiles: () => {},
    }
  }

  const [files, setFiles] = createSignal<UploadFile[]>([])
  const [isDragging, setIsDragging] = createSignal(false)
  const [isFocused, setIsFocused] = createSignal(false)
  const [isFileDialogActive, setIsFileDialogActive] = createSignal(false)
  const [errors, setErrors] = createSignal<FileErrors>({})

  const parcedAccept = parseAccept(accept)

  let rootRef!: T
  let inputRef!: HTMLInputElement

  /**
   * Set refs for root and input elements
   * Must be called inside a setTimout to ensure elements are mounted on the DOM as such:
   *
   * setTimeout(() => {
   *  setRefs(rootRef, inputRef)
   * })
   *
   * @param r Root element ref
   * @param i Input element ref
   * @returns void
   * @example
   * const { setRefs } = createDropzone<HTMLDivElement>()
   *
   * let rootRef!: HTMLDivElement
   * let inputRef!: HTMLInputElement
   *
   * setTimeout(() => {
   *  setRefs(rootRef, inputRef)
   * })
   *
   * return (
   *  <div ref={rootRef}>
   *    <input ref={inputRef} />
   *  </div>
   * )
   */
  const setRefs = (r: T, i: HTMLInputElement) => {
    rootRef = r
    inputRef = i
  }

  const removeError = (fileName: string) => {
    setErrors(prev => {
      if (!prev[fileName]) return prev
      const { [fileName]: _, ...rest } = prev
      return rest
    })
  }

  const removeFile = (fileName: string) => {
    const newFiles = files().filter(f => f.file.name !== fileName)
    setFiles(newFiles)
    removeError(fileName)

    if (inputRef) {
      const dataTransfer = new DataTransfer()
      newFiles.forEach(file => dataTransfer.items.add(file.file))
      const filesList = dataTransfer.files
      inputRef.files = filesList
    }
  }

  const clearFiles = () => {
    setFiles([])
    setErrors({})

    if (inputRef) {
      inputRef.value = ""
    }
  }

  const openFileDialog = () => {
    if (disabled) return

    if (inputRef) {
      clearFiles()

      inputRef.click()
      setIsFileDialogActive(true)
    }
  }

  const handleFiles = (files: FileList) => {
    if (disabled) return

    clearFiles()

    const transformedFiles = transformFiles(files)

    if (validator) {
      const validFiles = transformedFiles.filter(file => validator(file, transformedFiles))
      setFiles(validFiles)
    } else {
      const errors = validateFiles(transformedFiles, parcedAccept, maxSize, minSize, maxFiles)
      const validFiles = transformedFiles.filter(file => !errors[file.name])

      setFiles(validFiles)
      setErrors(errors)

      if (inputRef) {
        const dataTransfer = new DataTransfer()
        validFiles.forEach(file => dataTransfer.items.add(file.file))
        const filesList = dataTransfer.files
        inputRef.files = filesList
      }
    }
  }

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (disabled) return
    if (noDrag) return
  }

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (disabled) return
    if (noDrag) return

    setIsDragging(false)
  }

  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (disabled) return
    if (noDrag) return

    setIsDragging(true)
  }

  const handleDragStart = (e: DragEvent) => {
    if (disabled) return
    if (noDrag) return
  }

  const handleDragEnd = (e: DragEvent) => {
    if (disabled) return
    if (noDrag) return
  }

  const handleDragExit = (e: DragEvent) => {
    if (disabled) return
    if (noDrag) return
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (disabled) return
    if (noDrag) return

    setIsDragging(false)

    const droppedFiles = e.dataTransfer?.files

    if (droppedFiles && droppedFiles.length) {
      handleFiles(droppedFiles)
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!rootRef || !rootRef.isEqualNode(e.target as T)) return

    if (disabled) return
    if (noKeyboard) return

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      openFileDialog()
    }
  }

  const handleFocus = (e: Event) => {
    if (disabled) return

    setIsFocused(true)
  }

  const handleBlur = (e: Event) => {
    if (disabled) return

    setIsFocused(false)
  }

  const handleClick = (e: Event) => {
    if (disabled) return
    if (noClick) return

    e.stopPropagation()
    const target = e.target as T
    if (target.tagName === "LABEL") return
    // @ts-ignore
    if (target.tagName === "INPUT" && target.type === "file") return
    openFileDialog()
  }

  const handleChange = (e: Event) => {
    if (disabled) return
    const files = (e.target as HTMLInputElement).files
    if (!files) return

    handleFiles(files)
    setIsFileDialogActive(false)
  }

  const combineHandlers = <
    I extends T | HTMLInputElement,
    E extends KeyboardEvent | MouseEvent | FocusEvent | Event,
  >(
    customHandler: Function,
    defaultHandler?: JSX.EventHandlerUnion<I, E>,
    e?: Event,
  ) => {
    customHandler(e)
    if (defaultHandler) {
      // @ts-ignore
      setTimeout(() => defaultHandler(e), 0)
    }
  }

  const getInputProps = ({
    refKey = "ref",
    onChange,
    onClick,
    ...rest
  }: GetInputPropsOptions = {}): JSX.InputHTMLAttributes<HTMLInputElement> => {
    return {
      [refKey]: inputRef,
      tabIndex: -1,
      type: "file",
      multiple,
      disabled,
      accept: parcedAccept,
      onChange: (e: Event) => combineHandlers(handleChange, onChange, e),
      onClick: (e: Event) => combineHandlers(handleClick, onClick, e),
      ...rest,
    }
  }
  const getRootProps = ({
    refKey = "ref",
    role,
    onKeyDown,
    onFocus,
    onBlur,
    onClick,
    onDragEnter,
    onDragOver,
    onDragLeave,
    onDrop,
    ...rest
  }: GetRootPropsOptions<T> = {}): JSX.HTMLAttributes<T> => ({
    [refKey]: rootRef,
    role: role || "presentation",
    onKeyDown: (e: KeyboardEvent) => combineHandlers(handleKeyDown, onKeyDown, e),
    onFocus: (e: Event) => combineHandlers(handleFocus, onFocus, e),
    onBlur: (e: Event) => combineHandlers(handleBlur, onBlur, e),
    onClick: (e: Event) => combineHandlers(handleClick, onClick, e),
    onDragStart: (e: DragEvent) => combineHandlers(handleDragStart, onDragEnter, e),
    onDragEnter: (e: DragEvent) => combineHandlers(handleDragEnter, onDragEnter, e),
    onDragOver: (e: DragEvent) => combineHandlers(handleDragOver, onDragOver, e),
    onDragLeave: (e: DragEvent) => combineHandlers(handleDragLeave, onDragLeave, e),
    onDragEnd: (e: DragEvent) => combineHandlers(handleDragEnd, onDragLeave, e),
    onDragExit: (e: DragEvent) => combineHandlers(handleDragExit, onDragLeave, e),
    onDrop: (e: DragEvent) => combineHandlers(handleDrop, onDrop, e),
    tabIndex: noKeyboard || disabled ? -1 : 0,
    ...rest,
  })

  return {
    isFocused,
    isFileDialogActive,
    isDragging,
    getRootProps,
    getInputProps,
    openFileDialog,
    setRefs,
    files,
    errors,
    removeFile,
    removeError,
    clearFiles,
  }
}

export { createDropzone }

export type { CreateDropzone, CreateDropzoneOptions, GetInputPropsOptions, GetRootPropsOptions }

export default createDropzone
