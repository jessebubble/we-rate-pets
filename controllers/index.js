const router = require('express').Router();
const cloudinary = require('cloudinary').v2;

const apiRoutes = require('./api');
const homeRoutes = require('./home-routes.js');
const dashboardRoutes = require('./dashboard-routes');

router.use('/api', apiRoutes);
router.use('/', homeRoutes);
router.use('/dashboard', dashboardRoutes);

router.use((req, res) => {
    res.status(404).end();
});

const path = require('path');
const applicationDirectory = path.dirname(require.main.filename);
console.log('applicationDirectory', applicationDirectory)

const uploadImage = async filename => {
    filename = `${applicationDirectory}/uploads/${filename}`;
    try {
        const phot = await cloudinary.uploader.upload(filename, {
            use_filename: true,
            unique_filename: false
        });
        console.log('after cloudinary upload', photo)
        //return photo;

        return await cloudinary.url(photo.public_id, {
            width: 400,
            quality: 'auto',
            fetch_format: 'auto',
            secure: true
        });
    } catch (error) {
        console.log('uploadImage error', JSON.stringify(error))
        throw new Error(error);
    }
};

const index = (req, res) => {
    return res.render('index', {
        intro: 'Welcome :)',
        photo: req.app.get('photo')
    });
};

const upload = async (req, res) => {
    const uploadedFile = req.file.file[0];
    const filename = uploadedFile.filename;
    console.log('filename', filename)
    try {
        const photo = await uploadImage(filename);
        console.log('photo', photo)
        req.app.set('photo', photo);
        return res.redirect(req.get('referer'));
    } catch(error) {
        console.log('upload error', JSON.stringify(error))
    }
};

module.exports = { 
    router, index, upload
};