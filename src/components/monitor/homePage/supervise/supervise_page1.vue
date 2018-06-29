<template>
  <div>
    <!-- 监管要求 > 监管对挂牌公司处罚情况 -->
    <div>
      <div class="queryConditionBox clearFloat">
        <div class="clearFloat">
          <!-- <input type="text">
          至 <input type="text"> -->
          <div class="floatLeft">
            <date-picker :prop="startDatePicker" @startDateEvent="startDateEvent"></date-picker>
          </div>
          <div class="floatLeft">
            <date-picker :prop="endDatePicker" @endDateEvent="endDateEvent"></date-picker>
          </div>
        </div>
        <div>
          <pull-down-list :prop="categoryData" @categoryEvent = "categoryEvent"></pull-down-list>
        </div>
        <div>
          关键字： <input v-model="queryCondition.keyword" type="text" placeholder="默认范围">
        </div>
        <div @click="query" class="queryBtn">查询</div>
      </div>
      <div v-if="isShowQueryResult" class="queryResult">
        <div v-if="hasResultData">
          <table>
            <thead>
              <th v-for="(item, index) of titleData" :key="index">{{item}}</th>
            </thead>
            <tbody>
              <tr v-for="(item, index) of dataList" :key="index">
                <td class="tableTd" @click="showDetails(item)">{{item.title}}</td>
                <td class="tableTd">{{item.category}}</td>
                <td class="tableTd">{{item.publish_date}}</td>
                <td class="tableTd"><a :href="item.url">来源</a></td>
              </tr>
            </tbody>
          </table>
          <pagination :prop="paginationData" @paginationSelect="paginationSelect"></pagination>
        </div>
        <div v-else>
          加载中。。。
        </div>
      </div>
      <div v-if="isShowDetails" class="detailsPopUp">
        <div class="detailsBox">
          <div>
            <h1>{{detailsData.title}}</h1>
            <p>发文日期：{{detailsData.date}}</p>
            <div>
              {{detailsData.content}}
            </div>
          </div>
          <span @click="closeDetails" class="closeBtn">×</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import commonMethods from '@/common/common.js'
import pagination from '@/components/common/pagination'
import pullDownList from '@/components/common/pullDownList'
import datePicker from '@/components/common/datePicker'
export default {
  data(){
    return {
      url: 'http://10.25.24.51:10189/aip/risk/regulatory?',
      isShowQueryResult: false,
      isShowDetails: false,
      hasResultData: false,
      queryCondition:{
        start_date: '',
        end_date: '',
        category: '',
        keyword: '',
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
      detailsData: {},
      categoryData: {title: '分类：', parentEvent: 'categoryEvent', default: '请选择', listWidth: 108, nowSelectWidth: 110, list: [ '行政处罚', '市场禁入', '行政复议']},
      titleData: [ '标题', '分类', '发文日期', '来源'],
      dataList: [
        // {NOTICEDATE: '2018-01-01', NOTICETITLE: '2018-02-02',INFOBODYCONTENT: '正文内容正文内容正文内容', SOURCENAME: 'wwww'},
        // {NOTICEDATE: '2018-01-01', NOTICETITLE: '2018-02-02',INFOBODYCONTENT: '正文内容正文内容正文内容', SOURCENAME: 'wwww'},
      ],
    }
  },
  components:{
    pagination,
    pullDownList,
    datePicker
  },
  methods:{
    query(){
      this.isShowQueryResult = true;
      this.hasResultData = false;
      this.sendData = JSON.parse(JSON.stringify(this.queryCondition));
      console.log('sendData', this.sendData)
      let url = this.url 
        // + 'start_date=&end_date=2018-06-01&category=市场禁入&keyword=&page=0&pagesize=10'
        + 'start_date=' + this.sendData.start_date + '&'
        + 'end_date=' + this.sendData.end_date + '&'
        + 'category=' + this.sendData.category + '&'
        + 'page=' + this.sendData.page + '&'
        + 'page_size=' + this.sendData.page_size + '&'
        + 'keyword=' + this.sendData.keyword;
      this.$_axios.get(url)
        .then(response => {
          const resultData = response.data.result;
          this.hasResultData = true;
          console.log('监管对挂牌公司处罚情况',resultData);
          this.paginationData.page_Count = Math.ceil(resultData.total_count / 10);
          this.paginationData.total_Count = resultData.total_count;
          this.dataList = JSON.parse(JSON.stringify(resultData.regulatory_news));
        })
        .catch(err => {
          console.log(err);
        });
    },
    paginationSelect(pageNumber){
      const sendData = JSON.parse(JSON.stringify(this.sendData));
      let url = this.url 
        // + 'start_date=&end_date=2018-06-01&category=市场禁入&keyword=&page='+ (pageNumber - 1) +'&pagesize=10'
        + 'start_date=' + sendData.start_date + '&'
        + 'end_date=' + sendData.end_date + '&'
        + 'category=' + sendData.category + '&'
        + 'page=' + (pageNumber - 1) + '&'
        + 'page_size=' + sendData.page_size + '&'
        + 'keyword=' + sendData.keyword;
      this.$_axios.get(url)
        .then(response => {
          const resultData = response.data.result;
          this.hasResultData = true;
          console.log('监管对挂牌公司处罚情况',resultData);
          this.dataList = JSON.parse(JSON.stringify(resultData.regulatory_news));
        })
        .catch(err => {
          console.log(err);
        });
    },
    categoryEvent(...data){
      this.queryCondition.category = data[0];
    },
    closeDetails(){
      this.isShowDetails = false;
      this.detailsData = {};
    },
    showDetails(item){
      this.isShowDetails = false;
      console.log(item)
      this.$_axios.get('http://10.25.24.51:10189/api/risk/regulatory_detail?id=' + item.id)
        .then(response => {
          console.log(item.title)
          this.isShowDetails = true;
          const resultData = response.data.result;
          this.detailsData.title = item.title;
          this.detailsData.date = resultData.news_detail.publish_date;
          this.detailsData.content = resultData.news_detail.content;
          console.log('详情',resultData);
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
  }
}
</script>

<style lang="less" scoped>
.queryConditionBox{
  width: 100%;
  height: 70px;
  margin-top: 30px;
  border-bottom: 1px solid #797979;
  >div{
    float: left;
    margin-left: 8px;
  }
  input{
    width: 110px;
    height: 25px;
    text-align: left;
    line-height: 25px;
  }
  .queryBtn{
    width: 75px;
    height: 30px;
    margin-left: 200px;
    line-height: 30px;
    text-align: center;
    cursor: pointer;
    border: 1px solid #797979;
    background-color: #fff;
    border-radius: 5px;
  }
}
.queryResult{
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
    .tableTd:nth-child(1){
      width: 100px;
      cursor: pointer;
    }
    .tableTd:nth-child(2){
      width: 160px;
    }
    .tableTd:nth-child(4){
      width: 100px;
    }
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
