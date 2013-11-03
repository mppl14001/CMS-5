function languageName(languageCode) {
	return languages.getLanguageInfo(languageCode).name
}

module.exports.languageName = languageName