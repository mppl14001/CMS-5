module.exports = function(mongoose) {
  var TagSchema = new mongoose.Schema({
  	text: {type: String}
  })

  var TagModel = mongoose.model('Tag', TagSchema)

  return TagModel
}