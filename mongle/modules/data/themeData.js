module.exports = 
    (rawThemeData) => {
        themeData = {
            "themeIdx": rawThemeData.themeIdx,
            "theme": rawThemeData.theme,
            "themeImg":rawThemeData.themeImg,
            "saves": rawThemeData.saves,
            "writer": rawThemeData.writer,
            "writerImg": rawThemeData.writerImg,
            "alreadyBookmarked": rawThemeData.alreadyBookmarked
        };
        return themeData;
    };