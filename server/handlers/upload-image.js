const aws = require("aws-sdk")
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY
const BUCKET = process.env.BUCKET

aws.config.update({
  region: "ap-northeast-1",
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
})

export default async (file) => {
  const s3 = new aws.S3()
  const params = {
    Bucket: BUCKET,
    Key: file.fileName,
    Expires: 60,
    ContentType: file.fileType,
  }

  return new Promise((resolve, reject) => {
    s3.getSignedUrl("putObject", params, (err, url) => {
      if (err) {
        reject(err)
      }
      resolve(url)
    })
  })
}
