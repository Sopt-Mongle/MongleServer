module.exports = 
    (rawSentenceData) => {
        sentenceData = {
            "sentenceIdx": rawSentenceData.sentenceIdx,
            "sentence": rawSentenceData.sentence,
            "likes": rawSentenceData.likes,
            "saves": rawSentenceData.saves,
            "writer": rawSentenceData.writer,
            "title": rawSentenceData.title,
            "author": rawSentenceData.author,
            "publisher": rawSentenceData.publisher
        
        };
        return sentenceData;
    };