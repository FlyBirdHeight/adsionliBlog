/**
 * @method handleFileing 处理归档目录页
 * @param {Array} pageList 文章列表
 * @param {Array} tagList 标签列表
 */
exports.handleFileing = (pageList, tagList) => {
    let returnData = new Map();
    for (let value of tagList) {
        returnData.set(value.label, []);
    }

    for (let value of pageList) {
        for (let tag of value.tags) {
            if (returnData.has(tag.label)) {
                returnData.get(tag.label).push(value);
            }
        }
    }

    return returnData;
}