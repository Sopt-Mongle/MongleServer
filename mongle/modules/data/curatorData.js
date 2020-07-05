module.exports = 
    (rawCuratorData) => {
        curatorData = {
            "curatorIdx": rawCuratorData.curatorIdx,
            "name": rawCuratorData.name,
            "img": rawCuratorData.img,
            "keyword": rawCuratorData.keyword,
            "subscribe": rawCuratorData.subscribe
        };
        return curatorData;
    };