<template>
  <div>
    <!-- 期权 >> 场内期权业务交易所公告信息监控 -->
    <div>
      <div class="queryConditionBox clearFloat">
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
                <td class="tableTd">{{item.NOTICEDATE}}</td>
                <td class="tableTd">{{item.NOTICETITLE}}</td>
                <td class="tableTd data-content">{{item.INFOBODYCONTENT}} <span @click="details(item, index)">{{item.details}}</span></td>
                <td class="tableTd">{{item.SOURCENAME}}</td>
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
export default {
  data(){
    return {
      url: 'http://10.25.24.51:10192/api/rest/nlp/risk/option_announce?',
      isShowQueryResult: false,
      hasResultData: false,
      queryCondition:{
        keyword: '',
        page: 1,
        page_size: 10
      },
      sendData: {},
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
  },
  methods:{
    paginationSelect(pageNumber){
      const sendData = JSON.parse(JSON.stringify(this.sendData));
      let url = this.url 
        + 'page=' + pageNumber + '&'
        + 'page_size=' + sendData.page_size + '&'
        + 'keyword=' + sendData.keyword;
      this.$_axios.get(url)
        .then(response => {
          console.log('场内期权业务交易所公告信息监控查询结果',response.data.result);
          this.dataList = JSON.parse(JSON.stringify(response.data.result.Announce_List));
          this.resultData = response.data.result.Announce_List;
          this.dataList.forEach(item => {
            item.NOTICEDATE = item.NOTICEDATE ? new Date(item.NOTICEDATE).toLocaleDateString() : '-';
            if(item.INFOBODYCONTENT && item.INFOBODYCONTENT.length > 175){
              item.INFOBODYCONTENT  = item.INFOBODYCONTENT.slice(0,175) + '...';
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
        + 'keyword=' + this.sendData.keyword;
      this.$_axios.get(url)
        .then(response => {
          this.hasResultData = true;
          console.log('场内期权业务交易所公告信息监控查询结果',response);
          this.paginationData.page_Count = response.data.result.Page_Count;
          this.paginationData.total_Count = response.data.result.Total_Count;

          this.dataList = JSON.parse(JSON.stringify(response.data.result.Announce_List));
          this.resultData = response.data.result.Announce_List;

          this.dataList.forEach(item => {
            item.NOTICEDATE = item.NOTICEDATE ? new Date(item.NOTICEDATE).toLocaleDateString() : '-';
            if(item.INFOBODYCONTENT && item.INFOBODYCONTENT.length > 175){
              item.INFOBODYCONTENT  = item.INFOBODYCONTENT.slice(0,175) + '...';
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
        item.INFOBODYCONTENT  = item.INFOBODYCONTENT.slice(0,175) + '...';
      } else {
        item.details = '收起';
        item.INFOBODYCONTENT = this.resultData[index].INFOBODYCONTENT;
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
