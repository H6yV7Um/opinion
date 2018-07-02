<template>
  <div>
    <!-- 新三板 监管公开信息 > 自律监管措施 -->
    <div>
      <div class="top">
        <div class="title">
          监管公告
        </div>
        <div class="link">
          首页 > 信息披露 > 监管公开信息 > 监管公告
        </div>
      </div>
      <div class="middle">
        <div class="clearFloat">
          <!-- 日期：<input type="text">
          至
          <input type="text"> -->
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
        <div class="clearFloat">
          关键字：<input v-model="queryCondition.keyword" class="kyeword" type="text" placeholder="关键字">
          公司名称/拼音/代码：<input v-model="queryCondition.equity_no" class="code" type="text" placeholder="公司名称/拼音/代码">
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
                <td>{{item.equity_name}}</td>
                <td>{{item.equity_no}}</td>
                <td><a :href="item.news_content" target="_bank">{{item.news_title}}</a></td>
                <td>{{item.news_date}}</td>
                <td>{{item.pub_type}}</td>
            </tr>
          </tbody>
        </table>
        <pagination :prop="paginationData" @paginationSelect="paginationSelect"></pagination>
      </div>
    </div>
  </div>
</template>

<script>
import pagination from '@/components/common/pagination'
import datePicker from '@/components/common/datePicker'
export default {
  data(){
    return{
      url: 'http://10.25.24.51:10189/api/risk/neeq_pub_info1?',
      isQueryResult: false,
      queryCondition:{
        keyword: '',
        start_date: '',
        end_date: '',
        news_date: '',
        equity_no: '',
        page: 0,
        page_size: 10
      },
      sendData: {},
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
      tableData:{
        th:[ '公司名称','公司代码', '新闻标题', '新闻日期', '公告类型 (为自律监管措施)'],
        tr: []
      }
    }
  },
  components:{
    pagination,
    datePicker
  },
  methods:{
    query(){
      this.isQueryResult = false;
      this.sendData = JSON.parse(JSON.stringify(this.queryCondition));
      // let url = this.url 
      //   // + 'start_date=2018-05-01&end_date=2018-06-14&keyword=&equity_no=&news_date=&page=1&pagesize=10';
      //   + 'page=' + this.sendData.page + '&'
      //   + 'pagesize=' + this.sendData.page_size + '&'
      //   + 'start_date=' + this.sendData.start_date + '&'
      //   + 'end_date=' + this.sendData.end_date + '&'
      //   + 'equity_no=' + this.sendData.equity_no + '&'
      //   + 'news_date=' + this.sendData.news_date + '&'
      //   + 'keyword=' + this.sendData.keyword;
      for(let key in this.sendData){
        if(this.sendData[key] === ''){
          delete this.sendData[key];
        }
      }
      console.log('sendData',this.sendData)
      this.$_axios.get(this.url,{
        params:this.sendData
      }).then(response => {
        const resultData = response.data.result;
        this.isQueryResult = true;
        console.log('自律监管措施', resultData);
        this.tableData.tr = JSON.parse(JSON.stringify(resultData.neeq_pub));
        console.log(resultData.total_count)
        this.paginationData.total_Count = resultData.total_count;
        this.paginationData.page_Count = Math.ceil(resultData.total_count / 10);

      })
      .catch(err => {
        console.log(err);
      });
    },
    paginationSelect(pageNumber){
      const sendData = JSON.parse(JSON.stringify(this.sendData));
      // let url = this.url 
      //   // + 'start_date=2018-05-01&end_date=2018-06-14&keyword=&equity_no=&news_date=&page=1&pagesize=10';
      //   + 'page=' + (pageNumber -1) + '&'
      //   + 'pagesize=' + sendData.page_size + '&'
      //   + 'start_date=' + sendData.start_date + '&'
      //   + 'end_date=' + sendData.end_date + '&'
      //   + 'equity_no=' + sendData.equity_no + '&'
      //   + 'news_date=' + sendData.news_date + '&'
      //   + 'keyword=' + sendData.keyword;
      sendData.page = pageNumber - 1;
      console.log('sendData',sendData)
      this.$_axios.get(this.url,{
        params:sendData
      }).then(response => {
        const resultData = response.data.result;
        this.isQueryResult = true;
        console.log('自律监管措施', resultData);
        this.tableData.tr = JSON.parse(JSON.stringify(resultData.neeq_pub));
      })
      .catch(err => {
        console.log(err);
      });
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
  // border-bottom: 1px solid #dd2626;
  >div{
    float: left;
    margin-top: 35px;
    margin-left: 45px;
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
      padding-top: 30px;
      padding-bottom: 20px;
    }
    .title:nth-child(1){
      width: 100px;
    }
    .title:nth-child(2){
      width: 100px;
    }
    .title:nth-child(4){
      width: 100px;
    }
    .title:nth-child(5){
      width: 100px;
    }
  }
}
</style>
