# image-size-png

A [Node](https://nodejs.org/en/) module to get dimensions of png files.

**This is a fork of https://github.com/image-size/image-size**, and only offers a subset of features.

## But why?

While supporting all the formats is great (which image-size does), sometimes we only need support for 1 or 2 specific formats. In that case, it would be performant to omit all the dead code.

## Supported formats

Only PNG is supported.

## Programmatic Usage

```shell
npm install image-size-png --save
```

or

```shell
yarn add image-size-png
```

### Synchronous

```javascript
const sizeOf = require("image-size-png")
const dimensions = sizeOf("images/funny-cats.png")
console.log(dimensions.width, dimensions.height)
```

### Asynchronous

```javascript
const sizeOf = require("image-size-png")
sizeOf("images/funny-cats.png", function (err, dimensions) {
  console.log(dimensions.width, dimensions.height)
})
```

NOTE: The asynchronous version doesn't work if the input is a Buffer. Use synchronous version instead.

Also, the asynchronous functions have a default concurrency limit of **100**
To change this limit, you can call the `setConcurrency` function like this:

```javascript
const sizeOf = require("image-size-png")
sizeOf.setConcurrency(123456)
```

### Using promises (nodejs 10.x+)

```javascript
const { promisify } = require("util")
const sizeOf = promisify(require("image-size-png"))
sizeOf("images/funny-cats.png")
  .then((dimensions) => {
    console.log(dimensions.width, dimensions.height)
  })
  .catch((err) => console.error(err))
```

### Async/Await (Typescript & ES7)

```javascript
const { promisify } = require("util")
const sizeOf = promisify(require("image-size-png"))(async () => {
  try {
    const dimensions = await sizeOf("images/funny-cats.png")
    console.log(dimensions.width, dimensions.height)
  } catch (err) {
    console.error(err)
  }
})().then((c) => console.log(c))
```

### Multi-size

If the target file is an icon (.ico) or a cursor (.cur), the `width` and `height` will be the ones of the first found image.

An additional `images` array is available and returns the dimensions of all the available images

```javascript
const sizeOf = require("image-size-png")
const images = sizeOf("images/multi-size.ico").images
for (const dimensions of images) {
  console.log(dimensions.width, dimensions.height)
}
```

### Using a URL

```javascript
const url = require("url")
const http = require("http")

const sizeOf = require("image-size-png")

const imgUrl = "http://my-amazing-website.com/image.jpeg"
const options = url.parse(imgUrl)

http.get(options, function (response) {
  const chunks = []
  response
    .on("data", function (chunk) {
      chunks.push(chunk)
    })
    .on("end", function () {
      const buffer = Buffer.concat(chunks)
      console.log(sizeOf(buffer))
    })
})
```

You can optionally check the buffer lengths & stop downloading the image after a few kilobytes.
**You don't need to download the entire image**

### Disabling certain image types

```javascript
const imageSize = require("image-size-png")
imageSize.disableTypes(["tiff", "ico"])
```

### Disabling all file-system reads

```javascript
const imageSize = require("image-size-png")
imageSize.disableFS(true)
```

### JPEG image orientation

If the orientation is present in the JPEG EXIF metadata, it will be returned by the function. The orientation value is a [number between 1 and 8](https://exiftool.org/TagNames/EXIF.html#:~:text=0x0112,8%20=%20Rotate%20270%20CW) representing a type of orientation.

```javascript
const sizeOf = require("image-size-png")
const dimensions = sizeOf("images/photo.jpeg")
console.log(dimensions.orientation)
```

## Command-Line Usage (CLI)

```shell
npm install image-size-png --global
```

or

```shell
yarn global add image-size-png
```

followed by

```shell
image-size-png image1 [image2] [image3] ...
```

## Credits

Huge props to [image-size](https://github.com/image-size/image-size) library.

## [Contributors]

All contributors to image-size are contributors to image-size-png.
