const express = require('express'); //"^4.13.4"
const aws = require('aws-sdk'); //"^2.2.41"
const bodyParser = require('body-parser');
const multer = require('multer'); // "^1.3.0"
const multerS3 = require('multer-s3'); //"^2.7.0"
const ejs = require('ejs');

aws.config.update({
    secretAccessKey: '',
    accessKeyId: '',
    region: ''
});

const app = express();
const s3 = new aws.S3();

app.use(bodyParser.json());
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

//open http://localhost:3000/ in browser to see upload form
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/views/index.html');
});

//used by upload form
app.post('/uploadID', (req, res) => {
	let upload = multer({
    storage: multerS3({
        s3: s3,
        acl: 'public-read',
        bucket: 'nodeapptestbucket',
        key: function (req, file, cb) {
            console.log(file);
            cb(null, file.originalname);
        }
    })
}).single('ID');
	 upload(req, res, function(err) {
        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        else if (!req.file) {
			return res.render('index', { errormessage: 'Please select an image to upload' });
        }
        else if (err instanceof multer.MulterError) {
            return res.send(err);
        }
        else if (err) {
            return res.send(err);
        }
		res.redirect("/uploadPhotoPage");
	 });
});

app.get('/uploadPhotoPage', (req,res) => {
	res.sendFile(__dirname + '/views/PhotoUpload.html');
});

app.post('/uploadPhoto', (req, res) => {
	let upload = multer({
    storage: multerS3({
        s3: s3,
        acl: 'public-read',
        bucket: 'nodeapptestbucket',
        key: function (req, file, cb) {
            console.log(file);
            cb(null, file.originalname);
        }
    })
}).single('Photo');
	 upload(req, res, function(err) {
        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        else if (!req.file) {
			return res.render('PhotoUpload', { errormessage: 'Please select an image to upload' });
        }
        else if (err instanceof multer.MulterError) {
            return res.send(err);
        }
        else if (err) {
            return res.send(err);
        }
		res.send("Uploaded!");
	 });
});

app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});