const ImageSchema = {
  name: 'Image',
  properties: {
    value: 'string'
  } 
}

class Image {

}

Image.schema = ImageSchema;

module.exports = Image;