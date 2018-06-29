<template>
  <div>
    <!-- 新三板 监管公开信息 > 问询函 -->
    <div>
      <div class="top">
        <div class="title">
          问询函
        </div>
        <div class="link">
          首页 > 信息披露 > 监管公开信息 > 问询函
        </div>
      </div>
      <div class="middle">
        <div>
          <!-- <pull-down-list :prop="inquiryLetterType"  @inquiryLetter = "inquiryLetter"></pull-down-list> -->
        </div>
        <div class="clearFloat">
          <!-- 日期：<input v-model="queryCondition.dateFrom" type="text">
          至
          <input v-model="queryCondition.dateTo" type="text"> -->
          <div class="floatLeft">
            <date-picker :prop="startDatePicker" @startDateEvent="startDateEvent"></date-picker>
          </div>
          <div class="floatLeft">
            <date-picker :prop="endDatePicker" @endDateEvent="endDateEvent"></date-picker>
          </div>
          <div class="floatLeft">
            <date-picker :prop="newsDatePicker" @newsDateEvent="newsDateEvent"></date-picker>
          </div>
        </div>
        <div>
          关键字：<input v-model="queryCondition.keyword" type="text">
        </div>
        <div class="queryBtn">
          <span @click="query">查询</span>
        </div>
      </div>
      <div v-if="isQueryResult" class="queryResult">
        <table>
          <tbody>
            <tr>
              <th v-for="(item, index) of tableData.th" 
                  :key="index" class="title">
                  {{item}}
              </th>
            </tr>
            <tr v-for="(item, index) of tableData.tr" 
                :key="index">
                <td>{{item.news_title}}</td>
                <td>{{item.news_date}}</td>
                <td>{{item.equity_no}}</td>
                <td>{{item.equity_id}}</td>
                <td>{{item.firm_type}}</td>
                <td>{{item.firm_reply}}</td>
            </tr>
          </tbody>
        </table>
        <pagination :prop="paginationData" @paginationSelect="paginationSelect"></pagination>
      </div>
    </div>
  </div>
</template>

<script>
import pullDownList from '@/components/common/pullDownList'
import pagination from '@/components/common/pagination'
import datePicker from '@/components/common/datePicker'
export default {
  data(){
    return{
      url: 'http://10.25.24.51:10189/api/risk/neeq_pub_info3?',
      isQueryResult: false,
      inquiryLetterType:{
        title: '', 
        parentEvent: 'inquiryLetter', 
        default: '全部', 
        listWidth: 148, 
        nowSelectWidth: 150, 
        nowSelectHeight: 25, 
        list:['全部类别', '年度问询函', '问询函']
      },
      tableData:{
        th:['新闻标题', '新闻日期', '公司代码', '证券简称', '公司类型', '公司回复'],
        tr: [
          {news_title: '2017-09-07', news_date: '000000', equity_no: '证券简称', equity_id: '年报问询函', firm_type: '年报问询函', firm_reply: '年报问询函'},
        ]
      },
      queryCondition:{
        start_date: '',
        end_date: '',
        keyword: '',
        equity_no: '',
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
      startDatePicker:{
        title: '日期：',
        parentEvent: 'startDateEvent'
      },
      endDatePicker:{
        title: '至：',
        parentEvent: 'endDateEvent'
      },
      newsDatePicker:{
        title: '新闻日期：',
        parentEvent: 'newsDateEvent'
      },
    }
  },
  components:{
    pullDownList,
    pagination,
    datePicker
  },
  methods:{
    query(){
      this.isQueryResult = false;
      this.sendDate = JSON.parse(JSON.stringify(this.queryCondition));
      // start_date=& end_date=&keyword=&equity_no=&news_date=&page=0&pagesize=10
      let url = this.url 
        // + 'start_date=&%20end_date=&keyword=&equity_no=&news_date=&page=0&pagesize=10'
        + 'page=' + this.sendData.page + '&'
        + 'pagesize=' + this.sendData.page_size + '&'
        + 'start_date=' + this.sendData.start_date + '&'
        + 'end_date=' + this.sendData.end_date + '&'
        + 'equity_no=' + this.sendData.equity_no + '&'
        + 'news_date=' + this.sendData.news_date + '&'
        + 'keyword=' + this.sendData.keyword;
      console.log(this.sendDate)
      this.$_axios.get(url)
      .then(response => {
        const resultData = response.data.result;
        this.isQueryResult = true;
        console.log('监管公开信息-问询函', resultData);
        this.tableData.tr = JSON.parse(JSON.stringify(resultData.neeq_pub));
        
        this.paginationData.total_Count = resultData.total_count;
        this.paginationData.page_Count = Math.ceil(resultData.total_count / 10);
      })
      .catch(err => {
        console.log(err);
      });
    },
    paginationSelect(pageNumber){
      const sendData = JSON.parse(JSON.stringify(this.sendData));
      let url = this.url 
        // + 'start_date=&%20end_date=&keyword=&equity_no=&news_date=&page=' + (pageNumber - 1) + '&pagesize=10'
        + 'page=' + (pageNumber - 1) + '&'
        + 'pagesize=' + sendData.page_size + '&'
        + 'start_date=' + sendData.start_date + '&'
        + 'end_date=' + sendData.end_date + '&'
        + 'equity_no=' + sendData.equity_no + '&'
        + 'news_date=' + sendData.news_date + '&'
        + 'keyword=' + sendData.keyword;
      this.$_axios.get(url)
      .then(response => {
        const resultData = response.data.result;
        this.isQueryResult = true;
        console.log('监管公开信息-问询函', resultData);
        this.tableData.tr = JSON.parse(JSON.stringify(resultData.neeq_pub));
      })
      .catch(err => {
        console.log(err);
      });
    },
    inquiryLetter(...data){
      this.queryCondition.type = data[0];
    },
    startDateEvent(...data){
      this.queryCondition.start_date = data[0];
    },
    endDateEvent(...data){
      this.queryCondition.end_date = data[0];
    },
    newsDateEvent(...data){
      this.queryCondition.news_date = data[0];
    },
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
.queryResult{
  table{
    width: 100%;
    border-collapse: collapse;
    border-top: 2px solid #a9a9a9;
    background: #FFFFFF;
  }
  tbody{
    display: table-row-group;
    vertical-align: middle;
    border-color: inherit;
    th{
      height: 40px;
      line-height: 40px;
      border: 1px solid #797979;
      background-color: #f0f5f9;
    }
    td{
      border: 1px solid #797979;
      text-align: center;
      vertical-align: middle;
    }
    .portionSpan{
      display: block;
      width: 100%;
      line-height: 25px;
      border-top: 1px solid #797979;
    }
    .portionSpan:nth-child(1){
      border-top: none;
    }
    .title:nth-child(1){
      width: 200px;
    }
    .title:nth-child(2){
      width: 95px;
    }
  }
}
</style>
