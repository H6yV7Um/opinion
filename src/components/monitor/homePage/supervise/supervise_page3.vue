<template>
  <div>
    <!-- 监管要求 > 最新监管规则解读 -->
    <div class="queryConditionBox clearFloat">
      <div class="queryCondition"> 
        <pull-down-list :prop="originDataList" @rulesOrigin='rulesOrigin'></pull-down-list>
      </div>
      <div class="queryCondition">
        <!-- 日期： <input type="text" v-model="queryCondition.dateFrom" placeholder="">
        至     <input type="text" v-model="queryCondition.dateTo" placeholder=""> -->
        <div class="floatLeft">
          <date-picker :prop="startDatePicker" @startDateEvent="startDateEvent"></date-picker>
        </div>
        <div class="floatLeft">
          <date-picker :prop="endDatePicker" @endDateEvent="endDateEvent"></date-picker>
        </div>
      </div>
      <div class="queryCondition"> 
        关键字： <input type="text" v-model="queryCondition.keyword" placeholder="默认范围">
      </div>
      <div class="queryBtn">
        <span @click="query">查询</span>
      </div>
    </div>
    <!-- 基金信息 -->
    <div v-if="isShowQueryResult">
      <div>
        <!-- <rules-list :prop="rulesListData"></rules-list> -->
        <table>
          <thead>
            <tr>
              <th v-for="(item, index) of tableData.th" :key="index" class="tableTitle">{{item}}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) of tableData.td" :key="index">
              <!-- <td>{{index + 1}}</td> -->
              <td @click="showDetails(item)">{{item.news_title}}</td>
              <td>{{item.news_date}}</td>
              <td>{{item.data_source}}</td>
            </tr>
          </tbody>
        </table>
        <pagination :prop="paginationData" @paginationSelect="paginationSelect"></pagination>
      </div>
      <div v-if="isShowDetails" class="detailsPopUp">
        <div class="detailsBox">
          <div>
            <h1>{{detailsData.news_title}}</h1>
            <p>
              <span>发文日期：{{detailsData.publish_date}}</span>
              <span>作者：{{detailsData.author}}</span>
              <span>来源：{{detailsData.data_source}}</span>
              <span><a :href="detailsData.url">链接</a></span>  
            </p>
            <div>
              {{detailsData.news_content}}
            </div>
          </div>
          <span @click="closeDetails" class="closeBtn">×</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import pullDownList from '@/components/common/pullDownList'
// import rulesList from '@/components/common/rulesList'
import pagination from '@/components/common/pagination'
import datePicker from '@/components/common/datePicker'
export default {
  data(){
    return {
      url: 'http://10.25.24.51:10189/api/risk/supervise_rule?',
      isShowQueryResult: false,
      isShowDetails: false,
      originDataList: {title: '来源：', parentEvent: 'rulesOrigin', default: '全部', listWidth: 108, nowSelectWidth: 110, list: [ '全部', '券商中国', '金融监管研究院' ]},
      rulesListData: [
        {id: '', news_date: '2018-06-08 00:00:00', news_title: '测试标题', data_source: '测试数据作者'},
      ],
      tableData: {
        th: ['标题', '发文日期', '来源'],
        td: [
          {id: '', news_date: '2018-06-08 00:00:00', news_title: '测试标题', data_source: '测试数据作者'},
        ]
      },
      detailsData: {},
      queryCondition:{
        start_date: '',
        end_date: '',
        keyword: '',
        data_source: '',
        page: 0,
        pagesize: 10,
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
    }
  },
  components:{
    pullDownList,
    // rulesList,
    pagination,
    datePicker
  },
  methods:{
    query(){
      this.isShowQueryResult = false;
      this.sendData = JSON.parse(JSON.stringify(this.queryCondition));
      console.log('sendData', this.sendData)
      let url = this.url 
        // + 'start_date=&end_date=&keyword=%E7%A8%8B%E5%BA%8F&data_source=&page=0&pagesize=10'
        + 'start_date=' + this.sendData.start_date + '&'
        + 'end_date=' + this.sendData.end_date + '&'
        + 'keyword=' + this.sendData.keyword + '&'
        + 'data_source=' + this.sendData.data_source + '&'
        + 'page=' + this.sendData.page + '&'
        + 'pagesize=' + this.sendData.pagesize;

      this.$_axios.get(url)
      .then(response =>{
        this.isShowQueryResult = true;
        const resultData = response.data.result;
        console.log('监管要求 > 最新监管规则解读', resultData);
        this.tableData.td = JSON.parse(JSON.stringify(resultData.news));
        this.paginationData.page_Count = Math.ceil(resultData.total_count / 10);
        this.paginationData.total_Count = resultData.total_count;
      })
      .catch(function(err){
        console.log(err);
      });
    },
    paginationSelect(pageNumber){
      const sendData = JSON.parse(JSON.stringify(this.sendData));
      let url = this.url 
        // + 'start_date=&end_date=&keyword=%E7%A8%8B%E5%BA%8F&data_source=&page=0&pagesize=10'
        + 'start_date=' + sendData.start_date + '&'
        + 'end_date=' + sendData.end_date + '&'
        + 'keyword=' + sendData.keyword + '&'
        + 'data_source=' + sendData.data_source + '&'
        + 'page=' + (pageNumber - 1) + '&'
        + 'pagesize=' + sendData.pagesize;

      this.$_axios.get(url)
      .then(response =>{
        this.isShowQueryResult = true;
        const resultData = response.data.result;
        console.log('监管要求 > 最新监管规则解读', resultData);
        this.tableData.td = JSON.parse(JSON.stringify(resultData.news));
      })
      .catch(function(err){
        console.log(err);
      });
    },
    closeDetails(){
      this.isShowDetails = false;
      this.detailsData = {};
    },
    showDetails(item){
      this.isShowDetails = false;
      console.log(item)
      this.$_axios.get('http://10.25.24.51:10189/api/risk/supervise_rule_detail?id=' + item.id)
        .then(response => {
          console.log(item)
          this.isShowDetails = true;
          const resultData = response.data.result;
          this.detailsData = JSON.parse(JSON.stringify(resultData.news_detail));
          console.log('详情',this.detailsData);
        })
        .catch(err => {
          console.log(err);
        });
    },
    rulesOrigin(...data){
      console.log(data[0])
      if(data[0] === '全部'){
        this.queryCondition.rulesOrigin = '';
      } else {
        this.queryCondition.rulesOrigin = data[0];
      }
    },
    startDateEvent(...data){
      this.queryCondition.start_date = data[0];
    },
    endDateEvent(...data){
      this.queryCondition.end_date = data[0];
    },
  }
}
</script>

<style lang="less" scoped>
.queryConditionBox{
  width: 100%;
  height: 70px;
  margin-top: 30px;
  border-bottom: 1px solid #797979;
  font: 400 13px/25px Arial;
  >div{
    float: left;
  }
  .queryCondition{
    margin-left: 20px;
    input{
      width: 110px;
      height: 25px;
      font: 400 13px/25px Arial;
    }
  }
  .queryBtn{
    margin-left: 80px;
    span{
      display: inline-block;
      width: 60px;
      height: 30px;
      text-align: center;
      font: 400 16px/30px Arial;
      cursor: pointer;
      border: 1px solid #797979;
      border-radius: 5px;
    }
  }
}
table{
  width: 900px;
  margin-top: 20px;
  border: 1px solid #797979;
  border-collapse: collapse;
  word-wrap: break-word;
  word-break: break-all;
  th{
    width: 100px;
    height: 40px;
    line-height: 40px;
    border: 1px solid #797979;
    background-color: #f0f5f9;
  }
  tr{
    border: 1px solid #797979;
  }
  td{
    text-align: center;
    vertical-align: middle;
    border: 1px solid #797979;
  }
  td:nth-child(1){
    text-decoration: underline;
    cursor: pointer;
  }
  .tableTitle:nth-child(1){
    width: 50px;
  }
}
.detailsPopUp{
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  border: 1px solid #797979;
  word-break:break-all;
  word-wrap:break-word;
  background-color: #fff;
  .detailsBox{
    position: relative;
    width: 900px;
    margin-left: auto;
    margin-right: auto;
    >div{
      height: 900px;
      overflow: hidden;
      >div{
        height: 823px;
        overflow-y: scroll;
      }
    }
    h1{
      text-align: center;
      line-height: 40px;
    }
    p{
      text-align: center;
      line-height: 30px;
      span{
        margin-left: 10px;
      }
    }
    .closeBtn{
      position: absolute;
      right: -50px;
      top: 30px;
      font-size: 40px;
      cursor: pointer;
    }
  }
}
</style>
