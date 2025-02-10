const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');
const stream = require('stream');

let gfsBucket;

mongoose.connection.once('open', () => {
  gfsBucket = new GridFSBucket(mongoose.connection.db, {
    bucketName: 'uploads'
  });
  console.log('GridFSBucket initialized.');
});


const uploadFile = (file) => {
  return new Promise((resolve, reject) => {
    if (!gfsBucket) {
      return reject(new Error("GridFSBucket not initialized"));
    }

    // Create an upload stream with the original file name and content type.
    const uploadStream = gfsBucket.openUploadStream(file.originalname, {
      contentType: file.mimetype,
    });

    // Create a stream from the file buffer
    const bufferStream = new stream.PassThrough();
    bufferStream.end(file.buffer);

    bufferStream.pipe(uploadStream)
      .on('error', (error) => {
        console.error('Error uploading file to GridFS:', error);
        reject(error);
      })
      .on('finish', () => {
        console.log(`File uploaded to GridFS with id: ${uploadStream.id}`);
        resolve(uploadStream.id);
      });
  });
};

const getFile = (id) => {
  return gfsBucket.openDownloadStream(new mongoose.Types.ObjectId(id));
};


const deleteFile = (id) => {
  return new Promise((resolve, reject) => {
    gfsBucket.delete(mongoose.Types.ObjectId(id), (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};

module.exports = {
  uploadFile,
  getFile,
  deleteFile,
};
