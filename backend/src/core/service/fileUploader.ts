export interface IFileUploader {
  uploadAdvertiserLogo(
    base64file: string,
    advertiserId: string
  ): Promise<{
    uploadedUrl: string;
  }>;
}

export class S3FileUploader implements IFileUploader {
  async uploadAdvertiserLogo(
    base64file: string,
    advertiserId: string
  ): Promise<{uploadedUrl: string}> {
    const s3 = new S3Client({});
    const base64Data = Buffer.from(
      // omit base64 prefix, use only data
      base64file.replace(/^data:image\/\w+;base64,/, ''),
      'base64'
    );
    // get type from base64 prefix
    // data:image/png;base64,
    const type = base64file.split(';')[0].split('/')[1];
    const key = `advertiser/${advertiserId}/logo`;
    const region = `eu-west-1`; // get from env?
    const bucket = `awsstack-s3publicread284bc08c-6kg3wm25q8tn`;
    const url = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
    const response = await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        ACL: 'public-read',
        Body: base64Data,
        ContentEncoding: 'base64',
        ContentType: `image/${type}`,
      })
    );

    return {
      uploadedUrl: url,
    };
  }
}
