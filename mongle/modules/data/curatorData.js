module.exports = 
    (rawCuratorData) => {
        curatorData = {
            "curatorIdx": rawCuratorData.curatorIdx,
            "name": rawCuratorData.name,
            "img": rawCuratorData.img,
            "introduce": rawCuratorData.introduce,
            "keyword": rawCuratorData.keyword,
            "keywordIdx": rawCuratorData.keywordIdx,
            "subscribe": rawCuratorData.subscribe,
            "alreadySubscribed": rawCuratorData.alreadySubscribed
        };
        return curatorData;
    };