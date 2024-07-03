const AWS = require("aws-sdk");

const uploadtoS3=(data, filename)=> {
    const BUCKET_NAME = process.env.AWS_BUCKET_NAME|| awsexpensebucket
    const IAM_USER_KEY = process.env.AWS_ACCESS_KEY|| AKIAZI2LHBEYPL2IHXXB
    const IAM_USER_SECRET = process.env.AWS_SECRET_KEY|| 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
    let s3bucket = new AWS.S3({
      accessKeyId: IAM_USER_KEY,
      secretAccessKey: IAM_USER_SECRET,
      Bucket: BUCKET_NAME,
    });
    
      var params = {
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: data,
        ACL:'public-read'
      };
      return new Promise((resolve,reject)=>{
        s3bucket.upload(params, (err, s3response) => {
          if (err) {
            console.log(err);
            reject(err)
          } else {
            console.log(s3response);
             resolve(s3response.Location)
          }
        });
      })
  };


module.exports={
    uploadtoS3
}