import { Table,Bucket } from "@serverless-stack/resources";


export function StorageStack({ stack, app }) {
    // Create the DynamoDB table
    const table = new Table(stack, "Notes", {
      fields: {
        userId: "string",
        noteId: "string",
      },
      primaryIndex: { partitionKey: "userId", sortKey: "noteId" },
    });
    // Create the S3 buckets
    const bucket = new Bucket(stack, "Uploads",{
        cors: [
          {
            maxAge: "1 day",
            allowedOrigins: ["*"],
            allowedHeaders: ["*"],
            allowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
          },
        ],
      });
    return {
      table,
      bucket
    };
  }