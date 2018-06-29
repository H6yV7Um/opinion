<template>
  <div>
    <!-- 股票 公告预警 -->
    <div>
      <div class="queryConditionBox clearFloat">
        <div class="floatLeft">
          <date-picker :prop="startDatePicker" @startDateEvent="startDateEvent"></date-picker>
        </div>
        <div class="floatLeft">
          <date-picker :prop="endDatePicker" @endDateEvent="endDateEvent"></date-picker>
        </div>
        <div @click="query" class="queryBtn">查询</div>
      </div>
      <div v-if="isShowQueryResult" class="queryResult">
        <div v-if="hasResultData">
          <table>
            <tbody>
              <tr>
                <th v-for="(item, index) of titleData" :key="index" class="tableTh" width:100px>{{item}}</th>
              </tr>
              <tr v-for="(item, index) of dataList" :key="index">
                <td>{{item.stock_name}}</td>
                <td>{{item.stock_code}}</td>
                <td>{{item.notice_title}}</td>
                <td class="data-content">{{item.notice_detail}} <span @click="details(item, index)">{{item.details}}</span></td>
                <td>{{item.notice_date}}</td>
                <td>{{item.notice_source}}</td>
                <td>{{item.notice_type}}</td>
              </tr>
            </tbody>
          </table>
          <pagination :prop="paginationData" @paginationSelect="paginationSelect"></pagination>
        </div>
        <div v-else>
          加载中。。。
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import pagination from '@/components/common/pagination'
import commonMethods from '@/common/common.js'
import datePicker from '@/components/common/datePicker'
export default {
  data(){
    return {
      url: 'http://10.25.24.51:10191/api/rest/nlp/risk/query_announce_risk?',
      isShowQueryResult: false,
      hasResultData: false,
      resultData: {},
      queryCondition:{
        page: 1,
        page_size: 10,
        from_date: '',
        to_date: ''
      },
      startDatePicker:{
        title: '日期：',
        parentEvent: 'startDateEvent',
        defaultDate: new Date()
      },
      endDatePicker:{
        title: '至：',
        parentEvent: 'endDateEvent',
        defaultDate: new Date()
      },
      sendData:{},
      paginationData: {
        parentEvent: 'paginationSelect',
        page_Count: 1,
        total_Count: 1,
        current: 1
      },
      titleData: [ '股票名称', '股票代码', '公告标题', '公告内容', '公告时间', '公告源', '公告类别'],
      dataList: [],
    }
  },
  components:{
    pagination,
    datePicker
  },
  computed:{

  },
  methods:{
    paginationSelect(pageNumber){
      const sendData = JSON.parse(JSON.stringify(this.sendData));
      let url = this.url 
        // + 'page=1&page_size=10&from_date=2018-05-17&to_date=2018-05-25'
        + 'page=' + pageNumber + '&'
        + 'page_size=' + sendData.page_size + '&'
        + 'from_date=' + sendData.from_date + '&'
        + 'to_date=' + sendData.to_date;
      this.$_axios.get(url)
        .then(response => {
          console.log('股票 公告预警',response.data.result);
          this.dataList = JSON.parse(JSON.stringify(response.data.result.Announce_List));
          this.resultData = response.data.result.Announce_List;
          this.dataList.forEach(item => {
            item.notice_date = item.notice_date ? commonMethods.formatDateTime(new Date(item.notice_date)) : '-';
            if(item.notice_detail && item.notice_detail.length > 220){
              item.notice_detail  = item.notice_detail.slice(0,220) + '...';
              item.details  = '...详情';
            }
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    query(){
      this.isShowQueryResult = true;
      this.hasResultData = false;
      this.sendData = JSON.parse(JSON.stringify(this.queryCondition));
      let url = this.url + 'page=' + this.sendData.page + '&'
        + 'page_size=' + this.sendData.page_size + '&'
        + 'from_date=' + this.sendData.from_date + '&'
        + 'to_date=' + this.sendData.to_date;
      console.log(this.sendData)
      this.$_axios.get(url)
        .then(response => {
          // 显示查询结果
          this.hasResultData = true;
          console.log('股票 公告预警',response.data.result);
          this.dataList = JSON.parse(JSON.stringify(response.data.result.Announce_List));
          this.resultData = response.data.result.Announce_List;
          this.paginationData.page_Count = response.data.result.Page_Count;
          this.paginationData.total_Count = response.data.result.Total_Count;
          this.dataList.forEach(item => {
            item.notice_date = item.notice_date ? commonMethods.formatDateTime(new Date(item.notice_date)) : '-';
            if(item.notice_detail && item.notice_detail.length > 220){
              item.notice_detail  = item.notice_detail.slice(0,220) + '...';
              item.details  = '...详情';
            }
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    details(item, index){
      if(item.details == '收起'){
        item.details = '...详情';
        item.notice_detail  = item.notice_detail.slice(0,220) + '...';
      } else {
        item.details = '收起';
        item.notice_detail = this.resultData[index].notice_detail;
      }
    },
    startDateEvent(...data){
      this.queryCondition.from_date = data[0];
      console.log(this.queryCondition)
    },
    endDateEvent(...data){
      this.queryCondition.to_date = data[0];
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
    width: 1180px;
    margin-top: 20px;
    border: 1px solid #797979;
    border-collapse: collapse;
    word-wrap: break-word;
    word-break: break-all;
    th{
      height: 40px;
      line-height: 40px;
      border: 1px solid #797979;
      background-color: #f0f5f9;
    }
    tr{
      height: 84px;
      overflow: hidden;
      border: 1px solid #797979;
    }
    td{
      text-align: center;
      vertical-align: middle;
      border: 1px solid #797979;
    }
    .data-content{
      position: relative;
      text-align: left;
      span{
        position: absolute;
        bottom: 0;
        right: 0;
        cursor: pointer;
        color: blue;
      }
    }
    .tableTh:nth-child(1){
      width: 80px;
    }
    .tableTh:nth-child(2){
      width: 80px;
    }
    .tableTh:nth-child(3){
      width: 120px;
    }
    .tableTh:nth-child(4){
      width: 200px;
    }
    .tableTh:nth-child(5){
      width: 80px;
    }
    .tableTh:nth-child(6){
      width: 90px;
    }
    .tableTh:nth-child(7){
      width: 180px;
    }
  }
}
</style>
