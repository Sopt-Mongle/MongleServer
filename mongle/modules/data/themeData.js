module.exports = 
    (rawThemeData) => {
        themeData = {
            "themeIdx": rawThemeData.themeIdx,
            "theme": rawThemeData.theme,
            "saves": rawThemeData.saves,
            "writer": rawThemeData.writer
        };
        return themeData;
    };