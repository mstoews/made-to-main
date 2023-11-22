import { db } from "./init";
const { logger } = require("firebase-functions");
const { onObjectFinalized } = require("firebase-functions/v2/firestore");

exports.updateOriginalImageURL = onObjectFinalized({ cpu: 2 }, async (event) => {

  const bucket = event.data.bucket; // The Storage bucket that contains the file.
  const filePath = event.data.name; // File path in the bucket.
  const contentType = event.data.contentType; // File content type.

  const file = bucket.file(filePath);
  const url = await file.getSignedUrl({
    action: 'read',
    expires: '03-09-2491'
  });

  const size = 'thumbnails';
  var pathStrSplit = filePath.split('/')
  var dirName = pathStrSplit.join('/');
  console.log(dirName);
  var fileExt = filePath.split('.').pop();
  var fileName = filePath.replace(/\.[^/.]+$/, "");
  fileName = fileName.replace(`/${size}`, '').replace(`_${size}x${size}`, '');
  fileName = fileName + '.' + fileExt;

  db.collection('originalImageList').where('fileName', '==', fileName).get().then(snapshot => {
    if (snapshot.empty) {
      logger.log('No matching documents.');
      return;
    }
    snapshot.forEach(doc => {
      db.collection('originalImageList').doc(doc.id).update({ imageSrc200: url[0] });
      logger.log(doc.id, '=>', doc.data());
    });
  }).catch(err => {
    logger.log(err);
  });



  // Exit if this is triggered on a file that is not an image.
  if (!contentType.startsWith("image/")) {
    return logger.log("This is not an image.");
  }

  return logger.log("Image URL's updated");
});

