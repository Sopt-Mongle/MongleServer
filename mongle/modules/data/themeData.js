module.exports = 
    (rawThemeData) => {
        themeData = {
            "themeIdx": rawThemeData.themeIdx,
            "theme": rawThemeData.theme,
            "themeImg":rawThemeData.themeImg,
            "themeImgIdx":rawThemeData.themeImgIdx,
            "saves": rawThemeData.saves,
            "writer": rawThemeData.writer,
            "writerImg": rawThemeData.writerImg,
            "alreadyBookmarked": rawThemeData.alreadyBookmarked,
            "sentenceNum": rawThemeData.sentenceNum,
            "curatorNum" : rawThemeData.curatorNum
        };
        return themeData;
    };