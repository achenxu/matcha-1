const multer = require('multer');

module.exports = (req, res) => {
    let save     = req.app.get('save'),
        {type}   = req.body,
        response = multer(save.image).single(type);
    response(req, res, (err) => {
        if (err) {
            res.send(err);
        } else if (req.file) {
            res.send(req.file.filename);
        }
    })
};