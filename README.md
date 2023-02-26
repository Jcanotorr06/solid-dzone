![solidjs card](https://assets.solidjs.com/banner?type=solid-dzone&background=tiles&project=%20)

[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg?style=for-the-badge&logo=pnpm)](https://pnpm.io/)
![NPM](https://img.shields.io/npm/l/solid-dzone?style=for-the-badge)
![package bundle size](https://img.shields.io/bundlephobia/minzip/solid-dzone?label=Size&style=for-the-badge)
![package version](https://img.shields.io/npm/v/solid-dzone?label=version&style=for-the-badge)
![npm downloads](https://img.shields.io/npm/dw/solid-dzone?style=for-the-badge)

Simple, high-quality drag'n'drop primitive for Solid JS
## Quick start

Install it:

```bash
npm i solid-dzone
# or
yarn add solid-dzone
# or
pnpm add solid-dzone
```

## Usage

```tsx
import createDropzone from "solid-dzone"

const MyDropZone = () => {
  const { 
    getRootProps,
    getInputProps,
    setRefs,
  } = createDropzone<HTMLDivElement>() // You MUST specify the type of the root element for proper typing

  let inputRef!: HTMLInputElement
  let rootRef!: HTMLDivElement

  setTimeout(() => {
    // Refs must be set inside a timeout to ensure the elements have been mounted
    setRefs(rootRef, inputRef)
  })

  return (
    <div {...getRootProps()} ref={rootRef}>
      <input {...getInputProps()} ref={inputRef}/>
    </div>
  )
}
```

### Dropzone Props Getters

The dropzone property getters are just two functions that return objects with properties you need to create the drag'n'drop zone. The root properties can be applied to whatever ellement you want, whereas the input properties **must** be applied to an `<input>`.

Note that whatever other props you want to add to the elements, you should always pass them through the functions, rather than applying them directly to avoid conflicts and unexpected behaviours.

```jsx
<div
  {...getRootProps({
    role: "button",
    onDrop: e => console.log("FILE WAS DROPPED")
  })}
>
```

### createDropzone options

| **Name**   | **Type** | **Notes**                                                                                                            |
|------------|----------|----------------------------------------------------------------------------------------------------------------------|
| ``disabled``   | ``boolean``  | Disable the dropzone                                                                                                 |
| ``maxSize``    | ``number``   | Maximum file size in bytes                                                                                           |
| ``minSize``    | ``number``   | Minimum file size in bytes                                                                                           |
| ``multiple``   | ``boolean``  | Allow multiple files                                                                                                 |
| ``maxFiles``   | ``number``   | Maximum number of files                                                                                              |
| ``accept``     | ``string[]`` | Array of allowed file types, see [link](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/accept) for possible values |
| ``noClick``    | ``boolean``  | Disable click to open file dialog                                                                                    |
| ``noKeyboard`` | ``boolean``  | Disable keyboard to open file dialog                                                                                 |
| ``noDrag``     | ``boolean``  | Disable drag'n'drop                                                                                                  |
| ``validator``  | ``function`` | Custom file validation, overrides default                                                                            |

### createDropzone return values
| **Name**           | **Type** | **Notes**                                                                                                              |
|--------------------|----------|------------------------------------------------------------------------------------------------------------------------|
| ``isFocused``          | ``function`` | Boolean signal that indicates whether the dropzone is focused or not                                                   |
| ``isFileDialogActive`` | ``function`` | Boolean signal that indicates whether the file dialog is open or not                                                   |
| ``isDragging``         | ``function`` | Boolean signal that indicates whether the a file is being dragged over the root or not                                 |
| ``getRootProps``       | ``function`` | Function that returns an object of props for the root element                                                          |
| ``getInputProps``      | ``function`` | Function that returns an object of props for the input element                                                         |
| ``openFileDialog``     | ``function`` | Function to programmatically open the file dialog                                                                      |
| ``setRefs``            | ``function`` | Set the root and input refs. **Must be called inside a ``setTimeout`` to ensure elements are mounted**                         |
| ``files``              | ``function`` | Signal that returns an array of files                                                                                                         |
| ``errors``             | ``function`` | Object containing errors. Each key is a file name and the value is an object containing the error message and the file |
| ``removeFile``         | ``function`` | Function to remove a specific file by name                                                                             |
| ``removeError``        | ``function`` | Function to remove a specific error by file name                                                                       |
| ``clearFiles``         | ``function`` | Function to clear all files                                                                                            |

### File type definition

| **Name** | **Type** |
|----------|----------|
| ``source``   | ``string``   |
| ``name``     | ``string``   |
| ``size``     | ``number``   |
| ``file``     | ``File``     |

## Contributors

[![contributors](https://contrib.rocks/image?repo=jcanotorr06/solid-qr)](https://github.com/jcanotorr06/solid-dzone/graphs/contributors)

## Licence

[MIT](LICENSE)
