module.exports = 
    (rawThemeData) => {
        themeData = {
            "themeIdx": rawThemeData.themeIdx,
            "theme": rawThemeData.theme,
            "saves": rawThemeData.saves,
            "writer": rawThemeData.writer,
            // "img": rawThemeData.img
        };
        return themeData;
    };