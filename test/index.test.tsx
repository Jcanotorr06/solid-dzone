import { createRoot, createSignal } from "solid-js"
import { isServer } from "solid-js/web"
import { describe, expect, it } from "vitest"
import { createDropzone } from "../src"

describe("environment", () => {
  it("runs on server", () => {
    expect(typeof window).toBe("object")
    expect(isServer).toBe(false)
  })
})

describe("createDropzone", () => {
  it("Returns a dropzone object containing the state, methods and signals", () => {
    createRoot(dispose => {
      const dropzone = createDropzone<HTMLDivElement>()

      const [clicked, setClicked] = createSignal(false)

      const handleClick = () => {
        setClicked(true)
      }

      expect(typeof dropzone).toBe("object")
      expect(typeof dropzone.isFocused).toBe("function")
      expect(typeof dropzone.isFileDialogActive).toBe("function")
      expect(typeof dropzone.isDragging).toBe("function")
      expect(typeof dropzone.getRootProps).toBe("function")
      expect(typeof dropzone.getInputProps).toBe("function")
      expect(typeof dropzone.openFileDialog).toBe("function")
      expect(typeof dropzone.setRefs).toBe("function")
      expect(typeof dropzone.files).toBe("function")
      expect(typeof dropzone.errors).toBe("function")
      expect(typeof dropzone.removeFile).toBe("function")
      expect(typeof dropzone.removeError).toBe("function")
      expect(typeof dropzone.clearFiles).toBe("function")

      const rootAttrs = dropzone.getRootProps({ onClick: handleClick })
      const inputAttrs = dropzone.getInputProps()

      const root = document.createElement("div")
      const input = document.createElement("input")

      Object.keys(rootAttrs).forEach(key => {
        // @ts-ignore
        const value = rootAttrs[key]
        root.setAttribute(key, value)
      })

      Object.keys(inputAttrs).forEach(key => {
        // @ts-ignore
        const value = inputAttrs[key]
        input.setAttribute(key, value)
      })

      let rootRef: HTMLDivElement = root
      let inputRef: HTMLInputElement = input

      setTimeout(() => {
        dropzone.setRefs(rootRef, inputRef)
      })

      expect(input.type).toBe("file")
      expect(root.tabIndex).toBe(0)
    })
  })
})
