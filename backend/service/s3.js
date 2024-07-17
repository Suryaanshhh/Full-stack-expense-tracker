const cloudinary=require("cloudinary").v2;


cloudinary.config({
  cloud_name: 'dmk123skn',
  api_key: '436668841279141',
  api_secret: 'i0nntY-l35DFnSbNXnTEAPjgIRg'
})

module.exports={
    cloudinary
}