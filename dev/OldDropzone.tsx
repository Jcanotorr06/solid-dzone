import { Component, createEffect, createSignal } from "solid-js"

import "./styles/global.css"

type DropZoneProps = {
  accept?: string[]
  autoFocus?: boolean
  multiple?: boolean
  disabled?: boolean
  maxFiles?: number
  maxFileSize?: number
  minFileSize?: number
  noClick?: boolean
  noKeyboard?: boolean
  noDrag?: boolean
}

const DropZone: Component<DropZoneProps> = props => {
  const { disabled } = props
  let dropzone!: HTMLInputElement
  const [files, setFiles] = createSignal<File[]>()
  const [error, setError] = createSignal<string | string[]>("")

  const fileTypes = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/gif",
    "image/svg+xml",
    "image/webp",
  ]

  const validateFile = (file: File) => fileTypes.includes(file.type)

  const validateFiles = (files: File[]) => {
    const validFiles: File[] = []
    files.forEach(file => {
      if (validateFile(file)) {
        validFiles.push(file)
      }
    })
    return validFiles
  }

  const returnFileSize = (number: number) => {
    if (number < 1024) {
      return number + "bytes"
    } else if (number >= 1024 && number < 1048576) {
      return (number / 1024).toFixed(2) + "KB"
    } else if (number >= 1048576) {
      return (number / 1048576).toFixed(2) + "MB"
    }
  }

  const onChange = (e: Event) => {
    const target = e.target as HTMLInputElement
    const files = target.files
    if (files) {
      setFiles(Array.from(files))
    }
  }

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
  }

  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault()
    const target = e.target as HTMLLabelElement
    target.classList.add("dropzone--over")
  }

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault()
    const target = e.target as HTMLLabelElement
    target.classList.remove("dropzone--over")
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    const files = e.dataTransfer?.files
    const target = e.target as HTMLLabelElement
    target.classList.remove("dropzone--over")
    if (files) {
      const fileArray = Array.from(files!)
      const validFiles = validateFiles(fileArray)
      setFiles(validFiles)
      dropzone.files = files
    }
  }

  return (
    <section class="container">
      <label
        for="file_drop"
        class="dropzone"
        role="presentation"
        tabIndex="0"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
        <input
          id="file_drop"
          name="file_drop"
          type="file"
          multiple
          ref={dropzone}
          onChange={onChange}
          tabIndex="-1"
          disabled={disabled}
        />
        <p>Drag and drop files here or click to select files</p>
      </label>
      <aside>
        <h4>Files</h4>
        {files() && (
          <ul>
            {files()!.map(file => {
              const url = URL.createObjectURL(file)
              return (
                <li>
                  <img src={url} height={80} />
                  {file.name} ({returnFileSize(file.size)})
                </li>
              )
            })}
          </ul>
        )}
      </aside>
    </section>
  )
}

export { DropZone }

export default DropZone
