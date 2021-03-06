const randomToken = require('random-token');

module.exports = (req, res) => {
    let token   = randomToken(16),
        {email} = req.body,
        db      = req.app.get('db'),
        mail    = req.app.get('mail'),
        promise = db.getByUnique('users', 'email', email),
        error   = (e) => {
            console.log(e);
            res.send(e);
        };

    promise.then((response) => {
        if (!response || response.activation) {
            res.send('404');
        } else {
            let username = response.username;

            promise = db.update('users', 'token', token, 'email', email);
            promise.then(() => {
                mail.resend(email, username, token,
                    (err, info) => console.log(err ? err : info));
                res.send('Mail has been sent');
            }).catch(error);
        }
    }).catch(error);
};
