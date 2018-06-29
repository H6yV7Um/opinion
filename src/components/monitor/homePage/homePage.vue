<template>
    <div>
        <div class="homePageMain clearFloat">
            <sidebar :prop="sidebarData"></sidebar>
            <div v-if="routerGoNow" class="homePageChildPage clearFloat">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>
<script>
import sidebar from './sidebar';
import homeContent from './homeContent';
export default {
    data(){
        return {
            isShowList: false,
            sidebarData: [
                {title: '股票', isShowList: false, list: [
                    {title: '新闻预警', path: '/homePage/stock_newsWarning', list: []},
                    {title: '公告预警', path: '/homePage/stock_afficheWarning', list: []},
                    {title: '财务信息预警', path: '/homePage/stock_financeWarning', list: []},
                    {title: '股价异动预警', path: '/homePage/stock_sharePriceWarning', list: []}
                ]},

                {title: '债券', isShowList: false, list: [
                    {title: '新闻预警', isShowList: false, path: '/homePage/homeContent', list: [
                        {title: '债券发行人负面新闻', path: '/homePage/bond_negativeNews'},
                        {title: '新闻收藏夹', path: '/homePage/bond_newsFavorite'}
                    ]},
                    {title: '公告预警', isShowList: false, path: '/homePage/homeContent', list: [
                        {title: '债券发行人公告', path: '/homePage/bond_issuerNotice'},
                        {title: '受托管理人、主承销商发布的公告', wordWrapping: true, path: '/homePage/bond_manageNotice'}
                    ]},
                    {title: '评级预警', isShowList: false, path: '/homePage/homeContent', list: [
                        {title: '评级信息', path: '/homePage/bond_ratingInformation'},
                        {title: '评级变动', path: '/homePage/bond_ratingChange'}
                    ]}
                ]},

                {title: '基金', isShowList: false, list: [
                    {title: '新闻预警', isShowList: false, path: '/homePage/homeContent', list: [
                        {title: '基金重仓股负面新闻', path: '/homePage/fund_shigekuraNews'},
                        {title: '基金管理人新闻', path: '/homePage/fund_managerNews'},
                        {title: '新闻收藏夹', path: '/homePage/fund_newsFavorite'}
                    ]},
                    {title: '公告预警', path: '/homePage/fund_issuerNotice', list: []},
                    {title: '基金情况', path: '/homePage/fund_info', list: []}
                ]},
                
                {title: '期货', isShowList: false, list: [
                    {title: '股指期货交易规则', path: '/homePage/stock_index_futures', list: []}
                ]},

                {title: '期权', isShowList: false, list: [
                    {title: '场内期权业务交易所公告信息监控', wordWrapping: true, path: '/homePage/shareOption_page1', list: []},
                    {title: '场内期权业务其他舆情监控', path: '/homePage/shareOption_page2', list: []}
                ]},

                {title: '新三板', isShowList: false, list: [
                    {title: '新闻预警', isShowList: false, path: '/homePage/NEEQ_NewsMonitoring', list: [
                        {title: '新三板持仓股票舆情监控', path: '/homePage/NEEQ_NewsMonitoring'},
                        {title: '新闻收藏夹', path: '/homePage/NEEQ_favorite'}
                    ]},
                    {title: '最新动态', isShowList: false, path: '/homePage/NEEQ_announcement', list: [
                        {title: '通知公告', path: '/homePage/NEEQ_announcement'},
                        {title: '股转动态', path: '/homePage/NEEQ_dynamic'}
                    ]},
                    {title: '监管公开信息', isShowList: false, path: '/homePage/NEEQ_selfMeasures', list: [
                        {title: '自律监管措施', path: '/homePage/NEEQ_selfMeasures'},
                        {title: '纪律处分', path: '/homePage/NEEQ_punishment'},
                        {title: '问询函', path: '/homePage/NEEQ_inquiryLetter'},
                    ]}
                ]},

                {title: '监管要求', isShowList: false, list: [
                    {title: '监管对挂牌公司处罚情况', path: '/homePage/supervise_page1', list: []},
                    {title: '一行两会、交易所、证券业协会、基金业协会发布的重要', wordWrapping: true, path: '/homePage/supervise_page2', list: []},
                    {title: '最新监管规则解读', path: '/homePage/supervise_page3', list: []}
                ]},

                {title: '法律法规', path: '/homePage/legislation', isShowList: false, lastChild: true, list: []},
            ]
        }
    },
    computed:{
        routerGoNow(){
           return this.$store.state.routerGoNow;
        }
    },
    components:{
        sidebar,
        homeContent
    },
    methods:{
        showList(){
            this.isShowList = !this.isShowList;
        }
    }
}
</script>
<style lang="less" scoped>

.homePageMain{
    width: 1719px;
}
.homePageChildPage{
    // background-color: #99FFFF;
    float: left;
    width: 1180px;
    margin-left: 65px;
    margin-top: 50px;
}
</style>

