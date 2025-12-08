const { Client, Storage, ID, InputFile } = require('node-appwrite');
const fs = require('fs');

// Initialize Appwrite Client
const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const storage = new Storage(client);

/**
 * Uploads a file to Appwrite Storage
 * @param {Object} file - The file object from multer (req.file)
 * @returns {Promise<string>} - The public URL of the uploaded file
 */
const uploadToAppwrite = async (file) => {
    try {
        const bucketId = process.env.APPWRITE_BUCKET_ID;

        // Correctly handle file upload for node-appwrite v11+
        // InputFile.fromPath(path, filename) is the correct way
        const inputFile = InputFile.fromPath(file.path, file.originalname);

        // Upload to Appwrite
        const response = await storage.createFile(
            bucketId,
            ID.unique(),
            inputFile
        );

        // Construct Public URL
        // https://cloud.appwrite.io/v1/storage/buckets/[BUCKET_ID]/files/[FILE_ID]/view?project=[PROJECT_ID]
        // Note: Make sure file permissions in Appwrite Console allow "Any" to "read"
        const fileUrl = `${process.env.APPWRITE_ENDPOINT}/storage/buckets/${bucketId}/files/${response.$id}/view?project=${process.env.APPWRITE_PROJECT_ID}`;

        // Delete local temp file
        fs.unlinkSync(file.path);

        return fileUrl;
    } catch (error) {
        console.error('Appwrite Upload Error:', error);
        throw new Error('Failed to upload image to Appwrite: ' + error.message);
    }
};

const deleteFile = async (fileUrl) => {
    try {
        if (!fileUrl) return;

        // Extract file ID from URL
        // URL format: .../files/[FILE_ID]/view...
        const match = fileUrl.match(/files\/([^\/]+)\/view/);
        if (!match || !match[1]) {
            // Only warn if it looks like an Appwrite URL
            if (fileUrl.includes(process.env.APPWRITE_ENDPOINT)) {
                console.warn('Could not extract file ID from URL:', fileUrl);
            }
            return;
        }

        const fileId = match[1];
        const bucketId = process.env.APPWRITE_BUCKET_ID;

        await storage.deleteFile(bucketId, fileId);
        console.log(`Deleted old file: ${fileId}`);
    } catch (error) {
        console.error('Appwrite Delete Error:', error);
        // Don't throw error to avoid stopping the main update process if deletion fails
    }
};

module.exports = { uploadToAppwrite, deleteFile };

