const User = require('./user.js');
const Comment = require('./Comment.js')

User.hasMany(Post, {
    foreignKey: 'user_id'
});


module.exports = { User, Comment };