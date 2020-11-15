import { S3Handler } from "aws-lambda";
import "source-map-support/register";
import { S3 } from "aws-sdk";
import * as csv from "csv-parser";

const BUCKET = "import-bucket-aws";
export const handler: S3Handler = (event, _context) => {
  try {
    const s3 = new S3({ region: "us-east-1" });
    console.log("importFileParser handler");
    event.Records.forEach((record) => {
      const s3Stream = s3
        .getObject({
          Bucket: BUCKET,
          Key: record.s3.object.key,
        })
        .createReadStream();
      s3Stream
        .pipe(csv())
        .on("data", (data) => console.log(data))
        .on("end", async () => {
          console.log(`Moving from ${BUCKET} file ${record.s3.object.key}`);
          await s3
            .copyObject({
              Bucket: BUCKET,
              CopySource: `${BUCKET}/${record.s3.object.key}`,
              Key: record.s3.object.key.replace("uploaded", "parsed"),
            })
            .promise();

          await s3
            .deleteObject({
              Bucket: BUCKET,
              Key: record.s3.object.key,
            })
            .promise();
        });
    });
  } catch (error) {}
};
