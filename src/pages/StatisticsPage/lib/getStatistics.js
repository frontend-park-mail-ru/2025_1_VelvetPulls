export const getStatistics = () => {
    const returnData = {
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
    };

    let averageRate = 0;
    let ratesCount = 0;
    for (const key in returnData) {
        averageRate += key * returnData[key];
        ratesCount += returnData[key];
    }
    averageRate /= ratesCount;
    averageRate = Math.round(averageRate * 100) / 100;

    returnData["averageRate"] = averageRate;

    return returnData;
};
