const AmazonS3URI = require('amazon-s3-uri');
const AWS = require('aws-sdk');
const helpers = require('../assets/helpers/helpers.js');
const multer = require('multer');
const multerS3 = require('multer-s3');


require('dotenv').config();

AWS.config.update({
  secretAccessKey: process.env.AWS_S3_SECRET,
  accessKeyId: process.env.AWS_S3_ID,
  region: 'us-east-1',
});

const s3 = new AWS.S3();

const uploadFiles = multer({
  storage: multerS3({
    s3: s3,
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    bucket: 'rvalibrary-deskbook',
    key: function(req, file, cb) {
      const fileName = JSON.parse(JSON.stringify(req.body));
      cb(null, fileName.name);
    }
  }),
  fileFilter: (req, file, cb) => {
    cb(null, true);
  }
}).single('upload');

module.exports = {
  async getBucket(req, res) {
    try{
      const params = {
        Bucket: 'rvalibrary-deskbook',
        MaxKeys: 30,
        Delimiter: '/',
      }
      if(!req.query.prefix){
        params.Prefix = `deskbook-uploads/public/`;
      } else {
        let prefix = 'deskbook-uploads/';
        if(Array.isArray(req.query.prefix)){
          req.query.prefix.forEach(str => {
            prefix += `${str}/`;
          })
          params.Prefix = prefix;
        } else {
          params.Prefix = `deskbook-uploads/${req.query.prefix}/`;
        }
      }
      const keys = await helpers.s3RetrieveAllKeys(s3, params);
      if(keys) {
        keys.push(helpers.findPreviousDirectory(params.Prefix));
        res.render('cms/media-home', {
          bucketData: keys,
          user: req.user,
          buildQueryArr: helpers.buildQueryArr,
          isDocument: helpers.isDocument,
        });
      } else {
        res.render('404')
      }
    } catch(err) {
      console.log('error', err);
    }

  },
  async getSignedURL(req, res) {
    const signedUrl = s3.getSignedUrl('getObject', {
      Bucket: 'rvalibrary-deskbook',
      Key: req.body.key,
    })
    res.send({signedUrl: signedUrl});
  },
  async newFolder(req, res) {
    try{
      if(req.body.folder.length){
        let key;
        req.body.folder = helpers.concatStrWithHyphens(req.body.folder);
        if(!req.body.prefix) {
          key =  `deskbook-uploads/public/${req.body.folder}/`;
        } else {
          key = 'deskbook-uploads/';
          req.body.prefix.forEach(prefix => {
            key += `${prefix}/`;
          });
        }
        s3.putObject({
          Key: `${key}${req.body.folder}/`,
          Bucket: 'rvalibrary-deskbook',
        }, (err, data) => {
          if(err){
            console.log(err);
          } else {
            res.send({successful: true, data: data});
          }
        })
      }
    } catch (err) {
      console.log(err);
    }
  },
  async upload(req, res) {
    try{
      uploadFiles(req, res, (err) => {
        if(err) {
          console.log('error inside upload method', err);
        } else {
          if(req.file.location) {
            res.send({success: true});
          }
        }
      })
    } catch (err) {
      console.log('this is an error', err);
    }
  },
  async delete(req, res) {
    try{
      s3.deleteObject({
        Bucket: 'rvalibrary-deskbook',
        Key: req.body.key,
      }, (err, data) => {
        if(err) {
          console.log(err);
        } else {
          res.send({success: true});
        }
      })
    } catch(err) {
      console.log(err);
    }
  },
  async deleteFolder(req, res) {
    try{
      if(req.body.key != 'deskbook-uploads/public/') {
        s3.deleteObject({
          Bucket: 'rvalibrary-deskbook',
          Key: req.body.key,
        }, (err, data) => {
          if(err) {
            console.log(err);
          } else {
            res.send({success: true});
          }
        })
      }
    } catch(err) {
      console.log(err);
    }
  },
}
