module.exports = function(mongoose) {
  var TranscriptionSchema = new mongoose.Schema({
  	approved: {type: Boolean},
  	text: {type: Buffer},
  	language: {type: String}
  })

  var TranscriptionSchema = new mongoose.Schema({
  	approved: {type: Boolean},
  	text: {type: String},
  	language: {type: String}
})

  return TranscriptionModel
}
