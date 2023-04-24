const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://sedangmembaik2520:Uj3tzyHvHjJqVXo8@cluster0.kj2u9be.mongodb.net/?retryWrites=true&w=majority', { dbName: 'list' })
const schema = {
    name: String,
    address: String,
    number: String,
    email: String
}
const lists = mongoose.model('list', schema)
module.exports = lists