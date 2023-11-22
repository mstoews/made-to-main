import { createUserApp } from "./create-user";
import { addAdminRoleToUser } from './add-admin-role'
import { createMessageApp } from "./create-message";
const  { getStorage } = require("firebase-admin/storage");
import { https } from "firebase-functions";


// const serviceAccountPath = `./made-to-cassie.json}`;
import { db } from "./init";
import { logger } from "firebase-functions";
const  { onObjectFinalized } = require("firebase-functions/v2/storage");

export const createUser = https.onRequest(createUserApp);
export const addAdminRole = https.onRequest(addAdminRoleToUser);
export const createMessage = https.onRequest(createMessageApp);

exports.updateOriginalImageURL = onObjectFinalized({ cpu: 2 }, async (event) => {

  // const bucket = event.bucket;
  const fileBucket = event.data.bucket;
  const filePath = event.data.name; // File path in the bucket.
  const contentType = event.data.contentType; // File content type.

  console.log(fileBucket);

  const url = await generatePutUrl (fileBucket, filePath)

  // const bucket = getStorage().bucket(fileBucket);

  // const downloadResponse = await bucket.file(filePath).getSignedUrl({
  //    action: 'read',
  //    expires: '03-09-2491'
  //  });

  // const url = downloadResponse[0];
  console.log(url);

  const size = 'thumbnails';
  var pathStrSplit = filePath.split('/')
  var dirName = pathStrSplit.join('/');
  console.log(dirName);
  var fileExt = filePath.split('.').pop();
  var fileName = filePath.replace(/\.[^/.]+$/, "");
  fileName = fileName.replace(`/${size}`, '').replace(`_${size}x${size}`, '');
  fileName = fileName + '.' + fileExt;

  console.log(fileName);

  db.collection('originalImageList').doc('test').set({ imageSrc200: 'TEST' });

  db.collection('originalImageList').where('fileName', '==', fileName).get().then(snapshot => {
    if (snapshot.empty) {
      logger.log('No matching documents.');
      return;
    }
    snapshot.forEach(doc => {
      db.collection('originalImageList').doc(doc.id).update({ imageSrc200: 'TEST' });
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


async function generatePutUrl (bucketID: string, path: string) {
  const options = {
    version: 'v4',
    action: 'write',
    expires: Date.now() + 60 * 60 * 1000, // 1 hour
  } as const

  const [url] = await new Storage()
    .bucket(bucketID)
    .file(path)
    .getSignedUrl(options)
    return url;
}

