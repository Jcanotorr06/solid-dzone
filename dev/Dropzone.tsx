import { createEffect, onMount } from "solid-js"
import createDropzone from "../src"

import "./styles/global.css"

const Dropzone = () => {
  const {
    getInputProps,
    getRootProps,
    setRefs,
    files,
    errors,
    isFocused,
    isDragging,
    isFileDialogActive,
    clearFiles,
    removeFile,
    removeError,
    openFileDialog,
  } = createDropzone<HTMLDivElement>({
    maxFiles: 2,
    maxSize: 370000,
    multiple: true,
    accept: ["image/*"],
  })

  let inputRef!: HTMLInputElement
  let rootRef!: HTMLDivElement

  setTimeout(() => {
    setRefs(rootRef, inputRef)
  })

  return (
    <section class="container">
      <div {...getRootProps()} ref={rootRef} class="dropzone">
        <input {...getInputProps()} ref={inputRef} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <button onClick={() => openFileDialog()}>Open File Dialog</button>
      <button onClick={() => clearFiles()}>Clear Files</button>

      <aside>
        <h4>Files</h4>
        <ul>
          {files().map(f => (
            <li>
              {f.name} - {f.size} bytes
              <button onClick={() => removeFile(f.name)}>Remove</button>
            </li>
          ))}
        </ul>
      </aside>
      <aside>
        <h4>Errors</h4>
        <ul>
          {Object.keys(errors()).map(key => (
            <li>
              {key} - {errors()[key]?.error}
              <button onClick={() => removeError(key)}>Remove</button>
            </li>
          ))}
        </ul>
      </aside>
    </section>
  )
}

export default Dropzone
