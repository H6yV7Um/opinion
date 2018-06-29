<template>
  <div>
    <!-- 债券 > 评级预警 >  评级信息 -->
    <div class="queryConditionBox clearFloat">
      <div>
        <div class="queryConditionGroup clearFloat">
          <div class="queryCondition clearFloat">
            <!-- 公告日期：<input v-model="queryCondition.start_date" type="text">
            至<input v-model="queryCondition.end_date" type="text"> -->
            <div class="floatLeft">
              <date-picker :prop="startDatePicker" @startDateEvent="startDateEvent"></date-picker>
            </div>
            <div class="floatLeft">
              <date-picker :prop="endDatePicker" @endDateEvent="endDateEvent"></date-picker>
            </div>
          </div>
          <div class="queryCondition">
            机构名称：<input v-model="queryCondition.companyname" type="text">
          </div>
        </div>
        <div class="queryConditionGroup clearFloat">
          <div class="queryCondition">
            <!-- 评级日期：<input v-model="queryCondition.ratingdate" type="text"> -->
            <date-picker :prop="ratingDatePicker" @ratingDateEvent="ratingDateEvent"></date-picker>
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
    <div v-if="isQueryResult" class="queryResult">
      <table>
        <tbody>
          <tr>
            <th v-for="(item, index) of tableData.th" :key="index" class="title">{{item}}</th>
          </tr>
          <tr v-for="(item, index) of tableData.tr" :key="index">
            <td>{{index + 1}}</td>
            <td>{{item.notice_date}}</td>
            <td>{{item.companycode}}</td>
            <td>{{item.companyname}}</td>
            <td>{{item.creditcode}}</td>
            <td>{{item.creditname}}</td>
            <td>{{item.title}}</td>
            <td>{{item.rating}}</td>
            <td>{{item.ratefwd}}</td>
            <td>{{item.rate_type}}</td>
          </tr>
        </tbody>
      </table>
      <pagination :prop="paginationData" @paginationSelect="paginationSelect"></pagination>
      <!-- <rating-change :prop="ratingChangeData"></rating-change> -->
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
      url: 'http://10.25.24.51:10193/api/risk/bond_rate_info?',
      isQueryResult:false,
      ratingChangeData: [],
      queryCondition:{
        start_date: '',
        end_date: '',
        companyname: '',
        ratingdate: '',
        creditname: '',
        page: 0,
        pagesize: 10
      },
      sendData:{},
      tableData:{
        th:['序号', '公告日期', '公司代码', '机构名称', '评级机构代码', '评级机构名称', '来源标题', '信用评级', '评级展望', '信用评级类型'],
        tr: [
          {notice_date: '', companycode: '', companyname: '', creditcode: '', creditname: '', title: '', rating: '', ratefwd: '', rate_type: ''}
          // companycode companyname creditcode creditname itype/ notice_date rate_type ratefwd rating ratingdate title
        ]
      },
      paginationData:{
        parentEvent: 'paginationSelect',
        page_Count: 1,
        total_Count: 1,
        current: 1
      },
      ratingDatePicker:{
        title: '评级日期：',
        parentEvent: 'ratingDateEvent'
      },
      startDatePicker:{
        title: '公告日期：',
        parentEvent: 'startDateEvent'
      },
      endDatePicker:{
        title: '至：',
        parentEvent: 'endDateEvent'
      },
      ratingNameData: {title: '评级机构名称：', parentEvent: 'ratingName', default: '全部', listWidth: 230, nowSelectWidth: 150, list: [ '全部', '大公国际资信评估有限公司', '上海新世纪资信评估投资服务有限公司', '东方金诚国际信用评估有限公司', '联合信用评级有限公司', '联合资信评估有限公司', '中诚信证券评估有限公司', '鹏元资信评估有限公司']},
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
        // + 'start_date=2018-03-05&end_date=2018-03-06&companyname=&ratingdate=&creditname=&page=0&pagesize=10'
        + 'start_date=' + this.sendData.start_date + '&'
        + 'end_date=' + this.sendData.end_date + '&'
        + 'companyname=' + this.sendData.companyname + '&'
        + 'ratingdate=' + this.sendData.ratingdate + '&'
        + 'creditname=' + this.sendData.creditname + '&'
        + 'page=' + this.sendData.page + '&'
        + 'pagesize=' + this.sendData.pagesize;

      this.$_axios.get(url)
      .then(response =>{
        const resultData = response.data.result;
        console.log(JSON.stringify(response.data))
        this.isQueryResult = true;
        this.tableData.tr = JSON.parse(JSON.stringify(resultData.result));
        console.log(resultData.total_count)
        this.paginationData.total_Count = resultData.total_count;
        this.paginationData.page_Count = Math.ceil(resultData.total_count / 10);
        console.log('债券 > 评级预警 >  评级信息',resultData);
      })
      .catch(err =>{
        console.log(err);
      });
    },
    paginationSelect(pageNumber){
      const sendData = JSON.parse(JSON.stringify(this.sendData));
      let url = this.url 
        // + 'start_date=2018-03-05&end_date=2018-03-06&companyname=&ratingdate=&creditname=&page='+ (pageNumber-1) +'&pagesize=10'
        + 'start_date=' + sendData.start_date + '&'
        + 'end_date=' + sendData.end_date + '&'
        + 'companyname=' + sendData.companyname + '&'
        + 'ratingdate=' + sendData.ratingdate + '&'
        + 'creditname=' + sendData.creditname + '&'
        + 'page=' + (pageNumber-1) + '&'
        + 'pagesize=' + sendData.pagesize;
      this.$_axios.get(url)
      .then(response =>{
        const resultData = response.data.result;
        this.isQueryResult = true;
        this.tableData.tr = JSON.parse(JSON.stringify(resultData.result));
        console.log('债券 > 评级预警 >  评级信息',resultData);
      })
      .catch(err =>{
        console.log(err);
      });
    },
    startDateEvent(...data){
      this.queryCondition.start_date = data[0];
    },
    endDateEvent(...data){
      this.queryCondition.end_date = data[0];
    },
    ratingDateEvent(...data){
      this.queryCondition.ratingdate = data[0];
    },
    ratingName(...data){
      console.log('allData:',data)
      if(data[0] === '全部'){
        this.queryCondition.creditname = '';
      } else {
        this.queryCondition.creditname = data[0];
      }
    }
  }
}
</script>

<style lang="less" scoped>
.queryConditionBox{
  position: relative;
  width: 1180px;
  height: 120px;
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
  top: 45px;
  left: 650px;
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
    .title:nth-child(1){
      width: 35px;
    }
    .title:nth-child(2){
      width: 80px;
    }
    .title:nth-child(3){
      width: 80px;
    }
    .title:nth-child(5){
      width: 90px;
    }
    .title:nth-child(8){
      width: 80px;
    }
    .title:nth-child(9){
      width: 80px;
    }
    .title:nth-child(10){
      width: 95px;
    }
  }
}
</style>
