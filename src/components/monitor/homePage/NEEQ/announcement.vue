<template>
  <div>
    <!-- 新三板 最新动态 通知公告 -->
    <div class="top">
      <div class="title">
        通知公告
      </div>
      <div class="link">
        首页 > 最新动态 > 通知公告
      </div>
    </div>
    <div class="middle">
      <div>
        关键字：<input class="keyWordSearch" v-model="queryCondition.keyword" type="text" placeholder="请输入关键字">
      </div>
      <div class="queryDate">
        <!-- 日期：<input type="text" placeholder="日期"> -->
        <date-picker :prop="newsDatePicker" @newsDateEvent="newsDateEvent"></date-picker>
      </div>
      <div class="queryBtn">
        <span @click="query">查询</span>
      </div>
    </div>
    <div v-if="isQueryResult">
      <message-list :prop="announcementData"></message-list>
      <pagination :prop="paginationData" @paginationSelect="paginationSelect"></pagination>
    </div>
  </div>
</template>

<script>
import messageList from '@/components/common/messageList'
import pagination from '@/components/common/pagination'
import datePicker from '@/components/common/datePicker'
export default {
  data(){
    return {
      url: 'http://10.25.24.51:10189/api/risk/neeq_news?',
      isQueryResult: false,
      queryCondition: {
        keyword: '',
        news_date: '',
        page: 0,
        pagesize: 10
      },
      sendData:{},
      paginationData: {
        parentEvent: 'paginationSelect',
        page_Count: 1,
        total_Count: 1,
        current: 1
      },
      newsDatePicker:{
        title: '日期：',
        parentEvent: 'newsDateEvent'
      },
      announcementData: [
        // {id: 11, time: '06月05日', title: '测试数据标题测试测试数据标题', content: '通知公告通知公知公告通知公告'},
        // {id: 11, time: '06月05日', title: '测试数据标题测试数据试数据标题', content: '通知公告通知公告通知公告通知公告'},
      ]
    }
  },
  components:{
    messageList,
    pagination,
    datePicker
  },
  methods:{
    query(){
      this.isQueryResult = false;
      this.sendData = JSON.parse(JSON.stringify(this.queryCondition));
      let url = this.url + 'neeq_type=通知公告&'
        + 'keyword=' + this.sendData.keyword + '&'
        + 'news_date=' + this.sendData.news_date + '&'
        + 'page=' + this.sendData.page + '&'
        + 'pagesize=' + this.sendData.pagesize;
      console.log(this.sendData)
      this.$_axios.get(url)
      .then(response => {
        const resultData = response.data.result;
        this.isQueryResult = true;
        console.log(resultData)
        console.log(resultData.total_count)
        this.paginationData.page_Count = Math.ceil(resultData.total_count / 10);
        this.paginationData.total_Count = resultData.total_count;
        console.log(this.paginationData)

        this.announcementData = response.data.result.neeq_news.map(item => {
          const date = item.news_date.split('-')[1] + '月' + item.news_date.split('-')[2] + '日';
          return {
            id: item.neeq_id,
            neeq_type: item.neeq_type,
            time: date,
            title: item.news_title,
            content: item.sub_title,
          }
        });
      })
      .catch(err => {
        console.log(err);
      });
    },
    paginationSelect(pageNumber){
      console.log(this.sendData)
      const sendData = JSON.parse(JSON.stringify(this.sendData));
      console.log(sendData)
      let url = this.url + 'neeq_type=通知公告&'
        + 'keyword=' + sendData.keyword + '&'
        + 'news_date=' + sendData.news_date + '&'
        + 'page=' + (pageNumber - 1) + '&'
        + 'pagesize=' + sendData.pagesize;
      this.$_axios.get(url)
      .then(response => {
        const resultData = response.data.result;
        this.isQueryResult = true;
        console.log(resultData)

        this.announcementData = response.data.result.neeq_news.map(item => {
          const date = item.news_date.split('-')[1] + '月' + item.news_date.split('-')[2] + '日';
          return {
            id: item.neeq_id,
            neeq_type: item.neeq_type,
            time: date,
            title: item.news_title,
            content: item.sub_title,
          }
        });
      })
      .catch(err => {
        console.log(err);
      });
    },
    newsDateEvent(...data){
      this.queryCondition.news_date = data[0];
    }
  }
}
</script>

<style lang="less" scoped>
.top{
  position: relative;
  width: 100%;
  height: 100px;
  border-bottom: 2px solid #797979;
  .title{
    font-size: 38px;
    float: left;
  }
  .link{
    float: right;
    font-size: 20px;
  }
}
.top::after{
  position: absolute;
  bottom: -2px;
  left: 0;
  content: "";
  width: 100px;
  height: 2px;
  background-color: #f00;
  z-index: 1;
}
.middle{
  width: 100%;
  height: 120px;
  >div{
    float: left;
    margin-top: 35px;
    margin-left: 20px;
  }
  input{
    width: 130px;
    height: 25px;
    font: 400 13px/25px Arial;
  }
  .queryDate{
    margin-left: 70px;
  }
  .queryBtn{
    margin-left: 80px;
    span{
      display: inline-block;
      width: 60px;
      height: 30px;
      text-align: center;
      color: #fff;
      font: 400 16px/30px Arial;
      cursor: pointer;
      border-radius: 5px;
      background-color: #C82C37;
    }
  }
  .execl{
    width: 150px;
    height: 36px;
    margin-left: 100px;
    border: 1px solid #797979;
    line-height: 36px;
    cursor: pointer;
    .execlText{
      margin-left: 20px;
    }
  }
}
</style>
