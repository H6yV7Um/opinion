<template>
  <div>
    <!-- 债券 > 评级预警 >  评级变动 -->
    <div class="queryConditionBox clearFloat">
      <div>
        <div class="queryConditionGroup clearFloat">
          <div class="queryCondition">
            <!-- <span>披露日期：</span>
            <input v-model="queryCondition.start_date" type="text">
            <span>至</span>
            <input v-model="queryCondition.end_date" type="text"> -->
            <div class="floatLeft">
              <date-picker :prop="startDatePicker" @startDateEvent="startDateEvent"></date-picker>
            </div>
            <div class="floatLeft">
              <date-picker :prop="endDatePicker" @endDateEvent="endDateEvent"></date-picker>
            </div>
          </div>
          <div class="queryCondition">
            <!-- <span>变动日期：</span>
            <input v-model="queryCondition.changeDate" type="text"> -->
            <date-picker :prop="changeDatePicker" @changeDateEvent="changeDateEvent"></date-picker>
          </div>
        </div>
        <div class="queryConditionGroup clearFloat">
          <div class="queryCondition"> 
            <pull-down-list :prop="changeDirection"  @changeEvent = "changeEvent"></pull-down-list>
          </div>
          <div class="queryCondition">
            <pull-down-list :prop="ratingNameData" @ratingName = "ratingName"></pull-down-list>
          </div>
        </div>
      </div>
      <div class="queryBtn">
        <span @click="query">查询</span>
      </div>
    </div>
    <div v-if="isQueryResult">
      <!-- <rating-change :prop="ratingChangeData"></rating-change> -->
      <div class="queryResult">
        <table>
          <tbody>
            <tr>
              <th v-for="(item, index) of tableData.th" :key="index" class="title">{{item}}</th>
            </tr>
            <tr v-for="(item, index) of tableData.tr" :key="index">
              <td>{{index + 1}}</td>
              <td>{{item.notice_date}}</td>
              <td>{{item.changedate}}</td>
              <td>{{item.creditname}}</td>
              <td>{{item.creditcode}}</td>
              <td @click="portfoliocodeDetails(item)" class="portfoliocode">{{item.portfoliocode}}</td>
              <td>{{item.ratefwd}}</td>
              <td>{{item.rating}}</td>
              <td>{{item.ratingstyle}}</td>
              <td>{{item.ratingtype}}</td>
              <td>{{item.changeway}}</td>
              <td>{{item.reason}}</td>
            </tr>
          </tbody>
        </table>
        <pagination :prop="paginationData" @paginationSelect="paginationSelect"></pagination>
      </div>
    </div>
    <div v-if="isShowDetails" class="detailsPopUp">
      <div class="detailsBox">
        <div class="details">
          <ul>
            <li>债券名称：{{detailsData.securitysname}}</li>
            <li>债券全称：{{detailsData.securityname}}</li>
            <li>债券代码：{{detailsData.securitycode}}</li>
            <li>债券类型：{{detailsData.securitytype}}</li>
            <li>募集方式：{{detailsData.issuetype}}</li>
            <li>债券组合代码：{{detailsData.portfoliocode}}</li>
          </ul>
        </div>
        <span @click="closeDetails" class="closeBtn">×</span>
      </div>
    </div>
  </div>
</template>

<script>
import ratingChange from '@/components/common/ratingChangeList'
import pullDownList from '@/components/common/pullDownList'
import pagination from '@/components/common/pagination'
import datePicker from '@/components/common/datePicker'
export default {
  data(){
    return {
      url: 'http://10.25.24.51:10193/api/risk/bond_rate_change?',
      isQueryResult:false,
      isShowDetails: false,
      ratingChangeData: [],
      queryCondition:{
        start_date: '',
        end_date: '',
        changedate: '',
        changeway: '',
        creditname: '',
        page: 0,
        pagesize: 10
      },
      sendData:{},
      detailsData: {},
      tableData:{
        th:['序号', '公告日期', '变动日期', '评级机构名称', '评级机构代码', '债券组合代码', '评级展望', '信用评级', '评级方式', '评级类型', '评级变动方向', '变动原因'],
        tr: [
          {notice_date: '', changedate: '', creditcode: '', creditname: '', portfoliocode: '', ratefwd: '', rating: '', ratingstyle: '', ratingtype: '', changeway:'', reason: ''}
          //  变动日期changedate changeway creditcode creditname notice_date portfoliocode ratefwd rating ratingstyle ratingtype reason
        ]
      },
      paginationData:{
        parentEvent: 'paginationSelect',
        page_Count: 1,
        total_Count: 1,
        current: 1
      },
      changeDatePicker:{
        title: '变动日期：',
        parentEvent: 'changeDateEvent'
      },
      startDatePicker:{
        title: '披露日期：',
        parentEvent: 'startDateEvent'
      },
      endDatePicker:{
        title: '至：',
        parentEvent: 'endDateEvent'
      },
      ratingNameData: {title: '评级机构名称：', parentEvent: 'ratingName', default: '全部', listWidth: 230, nowSelectWidth: 150, list: [ '全部', '大公国际资信评估有限公司', '上海新世纪资信评估投资服务有限公司', '东方金诚国际信用评估有限公司', '联合信用评级有限公司', '联合资信评估有限公司', '中诚信证券评估有限公司', '鹏元资信评估有限公司']},
      changeDirection: {title: '评级变动方向：', parentEvent: 'changeEvent', default: '全部', listWidth: 150, nowSelectWidth: 150, list: [ '下调', '维持', '上调', '首次', '撤销']},
    }
  },
  components:{
    ratingChange,
    pullDownList,
    pagination,
    datePicker
  },
  methods:{
    query(){
      this.isQueryResult = false;
      this.sendData = JSON.parse(JSON.stringify(this.queryCondition));
      console.log('sendData', this.sendData)
      let url = this.url 
        // + 'start_date=&end_date=&changedate=&creditname=&changeway=03&page=0&pagesize=10';
        + 'start_date=' + this.sendData.start_date + '&'
        + 'end_date=' + this.sendData.end_date + '&'
        + 'changedate=' + this.sendData.changedate + '&'
        + 'creditname=' + this.sendData.creditname + '&'
        + 'changeway=' + this.sendData.changeway + '&'
        + 'page=' + this.sendData.page + '&'
        + 'pagesize=' + this.sendData.pagesize;
      console.log('请求')
      this.$_axios.get(url)
      .then(response => {
        const resultData = response.data.result;
        console.log(JSON.stringify(response.data))
        this.isQueryResult = true;
        this.tableData.tr = JSON.parse(JSON.stringify(resultData.result));
        this.paginationData.total_Count = resultData.total_count;
        this.paginationData.page_Count = Math.ceil(resultData.total_count / 10);
        console.log('债券 > 评级预警 >  评级变动',resultData);
      })
      .catch(err =>{
        console.log('请求失败');
      });
    },
    paginationSelect(pageNumber){
      const sendData = JSON.parse(JSON.stringify(this.sendData));
      let url = this.url 
        // + 'start_date=&end_date=&changedate=&creditname=&changeway=03&page='+ (pageNumber - 1) +'&pagesize=10';
        + 'start_date=' + sendData.start_date + '&'
        + 'end_date=' + sendData.end_date + '&'
        + 'changedate=' + sendData.changedate + '&'
        + 'creditname=' + sendData.creditname + '&'
        + 'changeway=' + sendData.changeway + '&'
        + 'page=' + (pageNumber - 1) + '&'
        + 'pagesize=' + sendData.pagesize;
      this.$_axios.get(url)
      .then(response => {
        const resultData = response.data.result;
        this.isQueryResult = true;
        this.tableData.tr = JSON.parse(JSON.stringify(resultData.result));
        console.log(resultData.total_count)
        this.paginationData.total_Count = resultData.total_count;
        this.paginationData.page_Count = Math.ceil(resultData.total_count / 10);
        console.log('债券 > 评级预警 >  评级变动',resultData);
      })
      .catch(err =>{
        console.log('请求失败');
      });
    },
    ratingName(...data){
      console.log('allData:',data)
      if(data[0] === '全部'){
        this.queryCondition.creditname = '';
      } else {
        this.queryCondition.creditname = data[0];
      }
    },
    changeEvent(...data){
      console.log('allData:',data)
      // '下调', '维持', '上调', '首次', '撤销'
      switch (data[0]) {
        case '下调':
          this.queryCondition.changeway = '03';
          break;
        case '维持':
          this.queryCondition.changeway = '01';
          break;
        case '上调':
          this.queryCondition.changeway = '02';
          break;
        case '首次':
          this.queryCondition.changeway = '04';
          break;
        case '撤销':
          this.queryCondition.changeway = '05';
          break;
        default:
          this.queryCondition.changeway = '';
          break;
      }
    },
    portfoliocodeDetails(item){
      this.isShowDetails = false;
      let url = 'http://10.25.24.51:10193/api/risk/bond_base_detail?'
        + 'portfoliocode=' + item.portfoliocode;
      this.$_axios.get(url)
      .then(response => {
        this.isShowDetails = true;
        const resultData = response.data.result;
        this.detailsData = JSON.parse(JSON.stringify(resultData.result));
        console.log(resultData)

      })
      .catch(err => {
        console.log(err);
      });
    },
    closeDetails(){
      this.isShowDetails = false;
      this.detailsData = {};
    },
    startDateEvent(...data){
      this.queryCondition.start_date = data[0];
    },
    endDateEvent(...data){
      this.queryCondition.end_date = data[0];
    },
    changeDateEvent(...data){
      this.queryCondition.changedate = data[0];
    },
  }
}
</script>

<style lang="less" scoped>
.queryConditionBox{
  position: relative;
  width: 1180px;
  height: 180px;
  // background-color: rgba(32,192,252, 0.1);
  border-bottom: 1px solid #797979;
  font: 400 13px/20px Arial;
  input{
    width: 110px;
    height: 25px;
    line-height: 25px;
  }
  .queryConditionGroup{
    width: 780px;
    margin-top: 20px;
  }
  .queryCondition{
    float: left;
    position: relative;
    margin-left: 20px;
    margin-top: 10px;
    input.break{
      position: relative;
      top: -15px; 
    }
  }
  .modelTitle{
    display: inline-block;
    max-width: 75px;
    height: 40px;
    text-align: left;
    line-height: 20px;
  }
}
.queryBtn{
  position: absolute;
  top: 65px;
  right: 400px;
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
      border: 1px solid #797979;
      height: 40px;
      line-height: 40px;
      background-color: #f0f5f9;
    }
    td{
      border: 1px solid #797979;
      text-align: center;
      vertical-align: middle;
      padding-top: 30px;
      padding-bottom: 20px;
    }
    .portfoliocode{
      cursor: pointer;
      text-decoration: underline;
    }
    .title:nth-child(1){
      width: 35px;
    }
    .title:nth-child(2){
      width: 80px;
    }
    .title:nth-child(3){
      width: 80px;
    }
    .title:nth-child(4){
      width: 90px;
    }
    .title:nth-child(5){
      width: 70px;
    }
    .title:nth-child(6){
      width: 70px;
    }
    .title:nth-child(7){
      width: 70px;
    }
    .title:nth-child(8){
      width: 70px;
    }
    .title:nth-child(9){
      width: 80px;
    }
    .title:nth-child(10){
      width: 95px;
    }
    .title:nth-child(11){
      width: 60px;
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
    width: 630px;
    margin-left: auto;
    margin-right: auto;
    .details{
      position: absolute;
      top: 100px;
      right: 0;
      bottom: 0;
      left: 100px;
      margin: auto;
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
