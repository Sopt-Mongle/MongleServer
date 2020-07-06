module.exports = 
    (rawThemeData) => {
        themeData = {
            "themeIdx": rawThemeData.themeIdx,
            "theme": rawThemeData.theme,
            "likes": rawThemeData.likes,
            "saves": rawThemeData.saves,
            "writer": rawThemeData.writer
        };
        return themeData;
    };