import { describe, expect, it } from "vitest"
import { isServer, renderToString } from "solid-js/web"
import { createDropzone } from "../src"

describe("environment", () => {
  it("runs on server", () => {
    expect(typeof window).toBe("undefined")
    expect(isServer).toBe(true)
  })
})

describe("createDropzone", () => {
  it("Returns a dropzone object containing the state, methods and signals", () => {
    const dropzone = createDropzone<HTMLDivElement>()

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
  })
})
