const router = require('express').Router();
const { User, Post } = require("../../models");
const withAuth = require('../../utils/auth'); //reference in  module 14.5.5

router.get('/', (req, res) => { // GET
    User.findAll({ // all users
        attributes: { exclude: ['password'] } // exlude passwords
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});
router.get('/:id', (req, res) => { // GET
    User.findOne({ // one user
        attributes: { exclude: ['password'] }, // exclude password
        where: {
            id: req.params.id
        },
        include: [
            {
                model: Post,
                attributes: ['id', 'title', 'image_url', 'post_body', 'created_at']
            },
            {
                model: Comment,
                attributes: ['comment_id', 'comment_text', 'created_at'],
                inclue: {
                    model: Post,
                    attributes: ['title']
                }
            },
            {
                model: Post,
                attributes: ['title']
            }
        ]
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id '});
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});
router.post('/', (req, res) => { // POST
    User.create({ // creates a new user
        username: req.body.username,
        password: req.body.password
    })
    .then(dbUserData => { // reference module 14.2.5
        req.session.save(() => { // gives server easy acces to user_id and username and confirmation of login
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;

            res.json(dbUserData);
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.post('/login', (req, res) => { //compares login entered to dbUserData
    User.findOne({
        where: {
            username: req.body.username
        }
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(400).json({ message: 'No user with that username' });
            return;
        }
        const validPassword = dbUserData.checkPassword(req.body.password);

        if (!validPassword) {
            res.status(400).json({ message: 'Password does not Match' });
            return;
        } 
        req.session.save(() => {
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;
            
            res.json({ user: dbUserData, message: 'login successful' });
        });
    });
});

router.post('/signup', (req, res) => { // compares signup info entered with whats saved in dbUserData
    User.findOne({
        where: {
            username: req.body.username
        }
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(400).json({ message: 'username not found' });
            return;
        }
        res.json(dbUserData);
    })
});

router.delete('/:id', withAuth, (req, res) => { //removes user 
    User.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.post('/logout', (req, res) => { // logouts user
    console.log(req.session.loggedIn);
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    }
    else {
        res.status(404).end();
    }
});

module.exports = router;