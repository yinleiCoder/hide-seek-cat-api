/**
 * 站酷控制器
 * @author yinlei
 */
/// axios network request
const http = require('../http');

class ZcoolController {

    /// 站酷搜索
    async findZcool(ctx) {
        let { keyword } = ctx.query;
        if(keyword == '') {
            keyword = '少女'
        }
        const response = await http.get(`search/content.json?word=${encodeURI(keyword)}&cate=0&type=0&recommendLevel=0&time=0&hasVideo=0&city=0&college=0&sort=5&limit=20&column=4&page=1`);
        const {data} = response.data.data;
        /// 主要是拿到object下的id字段方便获取详情
        ctx.body = data.map(item => item.object).filter(user => user.cover != null);
    }

    /// 站酷搜索详情
    async findZcoolDetail(ctx) {
        let { objectId } = ctx.query;
        if(objectId == '') {
            objectId = '9742172'
        }
        const response = await http.get(`work/content/show?p=1&objectId=${objectId}`);
        const {product, allImageList, } =  response.data.data;
    
        /// 主要获取allImageList字段
        ctx.body = {
            id: product.id,
            title: product.title,
            description: product.description,
            cover: product.cover,
            productTags: product.productTags.map(item => item.name),
            creatorObj: product.creatorObj,
            allImageList: allImageList.map(item => item.url),
        };
    }

}
module.exports = new ZcoolController();