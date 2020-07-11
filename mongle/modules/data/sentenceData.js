module.exports = 
    (rawSentenceData) => {
        sentenceData = {
            "sentenceIdx": rawSentenceData.sentenceIdx,
            "sentence": rawSentenceData.sentence,
            "themeIdx": rawSentenceData.themeIdx,
            "theme": rawSentenceData.theme,
            "likes": rawSentenceData.likes,
            "saves": rawSentenceData.saves,
            "writer": rawSentenceData.writer,
            "writerImg": rawSentenceData.writerImg,
            "title": rawSentenceData.title,
            "author": rawSentenceData.author,
            "publisher": rawSentenceData.publisher,
            "timestamp": rawSentenceData.timestamp,
            "alreadyLiked": rawSentenceData.alreadyLiked,
            "alreadyBookmarked": rawSentenceData.alreadyBookmarked
        };
        return sentenceData;
    };