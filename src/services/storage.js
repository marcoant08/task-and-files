
const googleStorage = require('@google-cloud/storage');

const storage = googleStorage({
    projectId: "projetojp-1b9ca",
    keyFilename: "../../serviceAccountKey.json"
});


const bucket = storage.bucket("projetojp-1b9ca.appspot.com");

module.exports = bucket
  