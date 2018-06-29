<template>
  <div>
    <!-- 期权 >> 场内期权业务其他舆情监控 -->
    <div>
      <div class="queryConditionBox clearFloat">
        <!-- <div>
          关键字： <input v-model="queryCondition.keyword" type="text" placeholder="默认范围">
        </div> -->
        <div>
          <date-picker :prop="startDatePicker" @startDateEvent="startDateEvent"></date-picker>
        </div>
        <div>
          <date-picker :prop="endDatePicker" @endDateEvent="endDateEvent"></date-picker>
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
                <td class="tableTd">{{item.SHOWTIME}}</td>
                <td class="tableTd">{{item.TITLE}}</td>
                <td class="tableTd data-content">{{item.CONTENT}} <span @click="details(item, index)">{{item.details}}</span></td>
                <td class="tableTd">{{item.SOURCE}}</td>
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
import commonMethods from '@/common/common.js'
import pagination from '@/components/common/pagination'
import datePicker from '@/components/common/datePicker'
export default {
  data(){
    return {
      url: 'http://10.25.24.51:10192/api/rest/nlp/risk/option_news?',
      isShowQueryResult: false,
      hasResultData: false,
      queryCondition:{
        from_date: '',
        to_date: '',
        page: 1,
        page_size: 10
      },
      sendData: {},
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
      paginationData: {
        parentEvent: 'paginationSelect',
        page_Count: 1,
        total_Count: 1,
        current: 1
      },
      titleData: [ '日期', '标题', '内容', '来源'],
      dataList: [
        // {NOTICEDATE: '2018-01-01', NOTICETITLE: '2018-02-02',INFOBODYCONTENT: '正文内容正文内容正文内容', SOURCENAME: 'wwww'},
        // {NOTICEDATE: '2018-01-01', NOTICETITLE: '2018-02-02',INFOBODYCONTENT: '正文内容正文内容正文内容', SOURCENAME: 'wwww'},
      ],
    }
  },
  components:{
    pagination,
    datePicker
  },
  methods:{
    paginationSelect(pageNumber){
      const sendData = JSON.parse(JSON.stringify(this.sendData));
      let url = this.url
        + 'page=' + pageNumber + '&'
        + 'page_size=' + sendData.page_size + '&'
        + 'from_date=' + sendData.from_date + '&'
        + 'to_date=' + sendData.to_date;
      this.$_axios.get(url)
        .then(response => {
          console.log('场内期权业务其他舆情监控',response.data.result);
          this.dataList = JSON.parse(JSON.stringify(response.data.result.Announce_List));
          this.resultData = response.data.result.Announce_List;
          this.dataList.forEach(item => {
            item.SHOWTIME = item.SHOWTIME ? new Date(item.SHOWTIME).toLocaleDateString() : '-';
            if(item.CONTENT && item.CONTENT.length > 175){
              item.CONTENT  = item.CONTENT.slice(0,175) + '...';
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
      console.log('sendData', this.sendData)
      let url = this.url 
        + 'page=' + this.sendData.page + '&'
        + 'page_size=' + this.sendData.page_size + '&'
        + 'from_date=' + sendData.from_date + '&'
        + 'to_date=' + sendData.to_date;
      this.$_axios.get(url)
        .then(response => {
          this.hasResultData = true;
          console.log('场内期权业务其他舆情监控',response);
          this.paginationData.page_Count = response.data.result.Page_Count;
          this.paginationData.total_Count = response.data.result.Total_Count;

          this.dataList = JSON.parse(JSON.stringify(response.data.result.Announce_List));
          this.resultData = response.data.result.Announce_List;

          this.dataList.forEach(item => {
            item.SHOWTIME = item.SHOWTIME ? new Date(item.SHOWTIME).toLocaleDateString() : '-';
            if(item.CONTENT && item.CONTENT.length > 175){
              console.log(item.CONTENT.indexOf('</p>'));
              item.CONTENT  = item.CONTENT.slice(0,175) + '...';
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
        item.CONTENT  = item.CONTENT.slice(0,175) + '...';
      } else {
        item.details = '收起';
        item.CONTENT = this.resultData[index].CONTENT;
      }
      
    }
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
    }
    .tableTd:nth-child(2){
      width: 160px;
    }
    .tableTd:nth-child(4){
      width: 100px;
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
  }
}
</style>
