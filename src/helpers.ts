import { CreateDropzoneOptions, FileErrors, UploadFile } from "./types"

export const transformFiles = (files: FileList | null): UploadFile[] => {
  const parsedFiles: UploadFile[] = []

  if (!files) return parsedFiles

  for (const i in files) {
    const fileIndex = +i
    if (isNaN(+fileIndex)) continue

    const file = files[fileIndex]
    if (!file) continue

    const parsedFile: UploadFile = {
      source: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      file,
    }

    parsedFiles.push(parsedFile)
  }

  return parsedFiles
}

const isMIMEtype = (accept: string) => {
  const MIMEregex =
    /^(application|audio|font|example|image|message|model|multipart|text|video)\/[a-z0-9!#$&^_`{}~*-]+$/i
  return MIMEregex.test(accept)
}

const isFileExtension = (accept: string) => {
  const fileExtensionRegex = /^\.[a-z0-9!#$&^_`{}~-]+$/
  return fileExtensionRegex.test(accept)
}

export const parseAccept = (accept?: string[]): string => {
  if (!accept) return ""

  const parsedAccept: string[] = []

  accept.forEach(acceptItem => {
    if (isMIMEtype(acceptItem) || isFileExtension(acceptItem)) {
      parsedAccept.push(acceptItem)
    }
  })

  return parsedAccept.join(",")
}

export const validateFiles = (
  files: UploadFile[],
  accept: string,
  maxFileSize?: number,
  minFileSize?: number,
  maxFiles?: number,
) => {
  const errors: FileErrors = {}
  if (maxFiles) {
    if (files.length > maxFiles) {
      const filesToBeRemoved = files.slice(maxFiles)
      filesToBeRemoved.forEach(file => {
        errors[file.name] = {
          error: `${file.name} has been removed, you can only upload ${maxFiles} files`,
          file,
        }
      })
    }
  }

  files.forEach(file => {
    if (maxFileSize) {
      if (file.size > maxFileSize) {
        errors[file.name] = { error: `${file.name} is too large`, file }
      }
    }

    if (minFileSize) {
      if (file.size < minFileSize) {
        errors[file.name] = { error: `${file.name} is too small`, file }
      }
    }

    const fileMimeLeft = file.file.type.split("/")[0]
    const fileExtension = file.file.name.split(".").pop()

    if (accept === "*" || accept === "" || accept === " ") return

    const acceptArray = accept.split(",")

    if (acceptArray.includes("*")) return

    if (acceptArray.includes(file.file.type)) return

    if (acceptArray.includes(fileMimeLeft + "/*")) return

    if (acceptArray.includes("." + fileExtension)) return

    if (accept && accept.includes(file.file.type)) return

    errors[file.name] = { error: `${file.name} is not an accepted file type`, file }
  })

  return errors
}

export const defaultProps = {
  disabled: false,
  maxSize: Infinity,
  minSize: 0,
  multiple: true,
  maxFiles: 0,
  accept: [],
  noClick: false,
  noKeyboard: false,
  noDrag: false,
} satisfies CreateDropzoneOptions
