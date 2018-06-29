<template>
  <div>
    <!-- 黑天鹅 退市警示 -->
    <div>
      <div>
        <h2>退市警示</h2>
      </div>
      <div class="queryConditionBox clearFloat">
        <div class="floatLeft">
          关键字：<input v-model="queryCondition.keyword" type="text">
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
                <td>{{item.TITLE}}</td>
                <td>{{item.SHOWTIME}}</td>
                <td class="data-content">{{item.CONTENT}} <span @click="details(item, index)">{{item.details}}</span></td>
                <td>{{item.SOURCE}}</td>
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
export default {
  data(){
    return {
      url: 'http://10.25.24.51:10192/api/rest/nlp/risk/delist_caution?news_type=0&',
      isShowQueryResult: false,
      hasResultData: false,
      resultData: null,
      queryCondition:{
        keyword: '',
        page: 1,
        page_size: 10,
      },
      sendData:{},
      paginationData: {
        parentEvent: 'paginationSelect',
        page_Count: 1,
        total_Count: 1,
        current: 1
      },
      titleData: [ '新闻标题', '新闻日期', '新闻内容', '新闻来源'],
      dataList: [],
    }
  },
  components:{
    pagination,
  },
  methods:{
    paginationSelect(pageNumber){
      const sendData = JSON.parse(JSON.stringify(this.sendData));
      let url = this.url 
        // + 'page=1&page_size=10&keyword='
        + 'page=' + pageNumber + '&'
        + 'page_size=' + sendData.page_size + '&'
        + 'keyword=' + sendData.keyword;
      this.$_axios.get(url)
        .then(response => {
          console.log('法律法规查询结果',response.data.result);
          this.dataList = JSON.parse(JSON.stringify(response.data.result.Announce_List));
          this.resultData = response.data.result.Announce_List;
          this.dataList.forEach(item => {
            item.SHOWTIME = item.SHOWTIME ? commonMethods.formatDateTime(new Date(item.SHOWTIME)) : '-';
            if(item.CONTENT && item.CONTENT.length > 210){
              item.CONTENT  = item.CONTENT.slice(0,210) + '...';
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
      let url = this.url 
        // + 'page=1&page_size=10&keyword='
        + 'page=' + this.sendData.page + '&'
        + 'page_size=' + this.sendData.page_size + '&'
        + 'keyword=' + this.sendData.keyword;
      console.log(this.sendData)
      this.$_axios.get(url)
        .then(response => {
          // 显示查询结果
          this.hasResultData = true;
          console.log('法律法规查询结果',response.data.result);
          this.dataList = JSON.parse(JSON.stringify(response.data.result.Announce_List));
          this.resultData = response.data.result.Announce_List;
          this.paginationData.page_Count = response.data.result.Page_Count;
          this.paginationData.total_Count = response.data.result.Total_Count;
          this.dataList.forEach(item => {
            item.SHOWTIME = item.SHOWTIME ? commonMethods.formatDateTime(new Date(item.SHOWTIME)) : '-';
            if(item.CONTENT && item.CONTENT.length > 210){
              item.CONTENT  = item.CONTENT.slice(0,210) + '...';
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
        item.CONTENT  = item.CONTENT.slice(0,210) + '...';
      } else {
        item.details = '收起';
        item.CONTENT = this.resultData[index].CONTENT;
      }
    },
  },
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
    width: 120px;
    height: 25px;
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
      overflow: hidden;
      border: 1px solid #797979;
    }
    td{
      height: 84px;
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
      width: 145px;
    }
    .tableTh:nth-child(2){
      width: 80px;
    }
    .tableTh:nth-child(4){
      width: 90px;
    }
  }
}
</style>
