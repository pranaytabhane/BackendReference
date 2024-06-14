const AWS = require("aws-sdk");
const convert = require('heic-convert');
const config = require("../config/config");
const sharp = require('sharp');
const fs = require('fs');
const { generateRandomString } = require("../middleware/utils")

const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, AWS_BUCKET_NAME } = config.config;

AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY_ID, // Access key ID
  secretAccesskey: AWS_SECRET_ACCESS_KEY, // Secret access key
  region: AWS_REGION, // Region
  correctClockSkew: true
});

const s3 = new AWS.S3();

const mediumSizeImages = {
    mediumSmall: [320, 240],
    medium: [480, 360],
    mediumLarge: [640, 480],
};

export const singleOrMultipleFileUploads = (fileToUpload, dataStoreIn, docType, userType, providerId) => {
    return new Promise(async (resolve, reject) => {
        let imageArray = []
        let imageArrayThumbnail = []
        let singleImage = ''
        let singleImageThumbnail = '' 
        if (Array.isArray(dataStoreIn)) {
            if (fileToUpload.length > 0) {
                for (const file of fileToUpload) {
                    const uploadImage = await uploadFile(file, docType, userType, providerId)
                    const thumbnailImage = await createImageThumbnail(file, docType, userType, providerId)
                    imageArray.push(uploadImage.Key)
                    imageArrayThumbnail.push(thumbnailImage.Key)
                }
            } else {
                const uploadImage = await uploadFile(fileToUpload, docType, userType, providerId)
                imageArray.push(uploadImage.Key)
                const thumbnailImage = await createImageThumbnail(fileToUpload, docType, userType, providerId)
                imageArrayThumbnail.push(thumbnailImage.Key)
            }
        } else {
            const uploadImage = await uploadFile(fileToUpload, docType, userType, providerId)
            singleImage = uploadImage.Key
            const thumbnailImage = await createImageThumbnail(fileToUpload, docType, userType, providerId)
            singleImageThumbnail = thumbnailImage.Key
        }
        const returnData = {
            imageArray,
            imageArrayThumbnail,
            singleImage,
            singleImageThumbnail
        }
        resolve(returnData)
    })
}

export const createImageThumbnail = async (file, docType, userType, providerId) => {
    try {
        let bufferData = file.data; // Buffer data
        let fileExtension = file.mimetype.split('/').pop()
        if (fileExtension == 'heic') {
            bufferData = await convert({
                buffer: bufferData, // the HEIC file buffer
                format: 'JPEG',      // output format
            });
            fileExtension = 'jpeg'
        }
        let thumbnail = sharp(bufferData)
        thumbnail = thumbnail.resize(...mediumSizeImages.mediumSmall)
        thumbnail = fileExtension == 'png' 
                    ? thumbnail.png({ compressionLevel: 9 })
                    : thumbnail.jpeg({ quality: 100 })

        thumbnail = await thumbnail.toBuffer();

        const fileName = `_${docType}-thumbnail-${Date.now()}-${generateRandomString(10)}.${fileExtension}`
        const key = `${userType}/${providerId}/${docType}-thumbnail/${fileName}`
    
        // Setting up S3 upload parameters
        const params = {
            Bucket: AWS_BUCKET_NAME,
            Body: thumbnail,
            Key: key,
        };
        // Uploading files to the bucket
        const result = await s3.upload(params).promise()
        return result;
    } catch (error) {
        console.log('Error: while uploading thumbnail image', error);
    }
};

export const uploadFile = async (file, docType, userType, providerId) => {
    try {
        let fileContent = file.data;
        let fileExtension = file.mimetype.split('/').pop()
        if (fileExtension == 'heic') {
            fileContent = await convert({
                buffer: fileContent, // the HEIC file buffer
                format: 'JPEG',      // output format
            });
            fileExtension = 'jpeg'
        }

        const fileName = `_${docType}-${Date.now()}-${generateRandomString(10)}.${fileExtension}`
        const key = `${userType}/${providerId}/${docType}/${fileName}`
    
        // Setting up S3 upload parameters
        const params = {
            Bucket: AWS_BUCKET_NAME,
            Body: fileContent,
            Key: key,
        };
        // Uploading files to the bucket
        const result = await s3.upload(params).promise()
        return result;
    } catch (error) {
        console.log('Error: while uploading file', error);
    }
};

export const getS3KeyAndUrl = (s3Keys) => {
    return new Promise(async (resolve, reject) => {
        const imageArray = []
        let imageObject = {}
        if (s3Keys) {
            if (Array.isArray(s3Keys)) {
                for (const key of s3Keys) {
                    const getUrl = await getSignedUrl(key)
                    imageArray.push({
                        key: key,
                        url: getUrl
                    })
                }
                resolve(imageArray)
            } else {
                const getUrl = await getSignedUrl(s3Keys)
                imageObject = {
                    key: s3Keys,
                    url: getUrl
                }
                resolve(imageObject)
            }
        } else {
            imageObject = {
                key: '',
                url: ''
            }
            resolve(imageObject)
        }
    })
}

export const getSignedUrl = async (key) => {
    /**
     * Generates a signed URL for accessing an object in an AWS S3 bucket.
     * @param {string} key - The key of the object in the S3 bucket.
     * @returns {Promise<string>} A promise that resolves with the signed URL for the object.
     *                           If an error occurs, the promise is rejected with the error.
     */
    return new Promise((resolve, reject) => {
        s3.getSignedUrl('getObject', {
            Key: key,
            Bucket: AWS_BUCKET_NAME,
            Expires: 60 * 60 * 6, // 6 hour
        } , (getObjectErr , getObjectUrl) => {
            if (getObjectErr) {
                console.error('Error getting S3 object: ', getObjectErr);
                reject(getObjectErr)
            } else {
                resolve(getObjectUrl)
            }
        });
    });
}

export const deleteFile = async (key) => {
    /**
     * Deletes an object from an AWS S3 bucket.
     * @param {string} key - The key of the object to delete.
     * @returns {Promise<boolean>} A promise that resolves to true if the object is successfully deleted, or rejects with an error.
     */
    return new Promise((resolve, reject) => {
        s3.deleteObject({
            Key: key,
            Bucket: AWS_BUCKET_NAME,
        } , (getObjectErr) => {
            if (getObjectErr) {
                console.error('Error Deleting S3 object: ', getObjectErr);
                reject(getObjectErr)
            }
            resolve(true)
        });
    });
}