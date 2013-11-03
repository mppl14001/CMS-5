module.exports = function(mongoose) {
  var ShownotesSchema = new mongoose.Schema({
  	content: {type: Buffer},
  	language: {type: String}
  })

  var ShownotesSchema = new mongoose.Schema({
  	content: {
  		type: String
  	},
  	language: {
  		type: String
  	}
  })

  ShownotesSchema.path('language').validate(function (v) { return v.length == 2 }, 'Language must be in iso-639-1')

  var ShownotesModel = mongoose.model('Shownotes', ShownotesSchema)
  return ShownotesModel
}
