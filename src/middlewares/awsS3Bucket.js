const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

const { s3Config } = require("../config/config")

// Configure AWS SDK with your credentials
AWS.config.update({
    accessKeyId: s3Config.accessKeyId,
    secretAccessKey: s3Config.secretAccessKey,
    bucket: s3Config.bucket,
    region: s3Config.region
});

//Create an instance of the S3 service
const s3 = new AWS.S3();

const checkBucketExists = async function () {
    try {
        const response = await s3.headBucket({ Bucket: s3Config.bucket }).promise();
        return response !== undefined;
    } catch (error) {
        if (error.code === 'NotFound') { return false; }
        throw error;
    }
};

const getPreSignedUrl = async function (objectKey) {
    // Define the parameters for the pre-signed URL
    const params = {
        Bucket: s3Config.bucket,
        Key: objectKey,
        Expires: 3600, // Set the expiration time for the URL in seconds (e.g., 1 hour = 3600 seconds)
    };
    // Generate the pre-signed URL
    return await s3.getSignedUrl('getObject', params);
};

/*// call S3 to retrieve policy for selected bucket
const bucketParams = { Bucket: s3Config.bucket };
s3.getBucketPolicy(bucketParams, function (err, data) {
    if (err) {
        console.log("Error", err);
    } else if (data) {
        console.log("Success", data.Policy);
    }
});*/

const generatePresignedUrl = async () => {
    const params = {
        Bucket: s3Config.bucket,
        Expires: 3600, // URL expiration time in seconds
        ACL: 'private', // Set the desired ACL for the uploaded file
    };
  
    return new Promise((resolve, reject) => {
        s3.createPresignedPost(params, (error, data) => {
            if (error) {
            reject(error);
            } else {
            resolve(data);
            }
        });
    });
}
// Create a multer middleware for handling file uploads
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: s3Config.bucket,
        acl: 'private', // Set the appropriate permissions
        contentType: multerS3.AUTO_CONTENT_TYPE,
        // contentEncoding: 'gzip',
        // contentDisposition: 'attachment',
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            let folder;
            switch (file.fieldname) {
                case  'profile':
                    folder = `users`;
                    break;
                case  'event_image':
                    folder = `events`;
                    break;
                case  'event_image':
                    folder = `events/tickets`;
                    break;
                default:
                    break;
            }
            cb(null, `${folder}/${Date.now().toString()}-${file.originalname}`);
        },
        shouldGeneratePresignedUrl: (req, file) => {
            return true; // Call generatePresignedUrl function for each file
        },
        generatePresignedUrl: generatePresignedUrl
    })
});

module.exports = { upload, checkBucketExists, getPreSignedUrl };
