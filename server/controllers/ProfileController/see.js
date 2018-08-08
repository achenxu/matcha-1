module.exports = (req, res) => {
    let first_id  = req.session.id,
        second_id = parseInt(req.body.id);
    if (first_id === undefined) {
        res.send('Need login');
        return;
    }
    if (!second_id || second_id === first_id) {
        res.send('Need User Id');
        return;
    }
    let db      = req.app.get('db'),
        promise = db.create('history',
            'first_id, second_id, `action`',
            [first_id, second_id, 'see']),
        error   = (e) => {
            console.log(e);
            res.send(e);
        };
    //TODO: write normal function, passing second user id
    let s =  req.app.get('socket');
    s.testfun();
    promise.then(() => res.send('I see you')).catch(error);
};
