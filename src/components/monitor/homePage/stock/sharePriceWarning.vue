<template>
  <div>
    <!-- 股票 > 股价异动预警 -->
    <div>
      <div class="queryConditionBox clearFloat">
        <div class="box">
          <div class="marginTop15">
            查询日期：<input type="text">
            至 <input type="text">
          </div>
          <div class="stockCode marginTop15 marginRight10">
            证券代码：<input type="text">
          </div>
          <div class="marginTop15">
            <pull-down-list :prop="organizationNameData" @organizationNameEvent='organizationNameEvent'></pull-down-list>
          </div>
          <div class="marginLeft20 marginTop15">
            震荡阈值：<input type="text">
          </div>
          <div @click="query" class="queryBtn">查询</div>
        </div>
      </div>
      <div v-if="isShowQueryResult" class="queryResult">
        <table>
          <thead>
            <th v-for="(item, index) of titleData" :key="index">{{item}}</th>
          </thead>
          <tbody>
            <tr v-for="(item, index) of resultData" :key="index">
              <td>{{item.number}}</td>
              <td>{{item.date}}</td>
              <td>{{item.code}}</td>
              <td>{{item.name}}</td>
              <td>{{item.change}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import pullDownList from '@/components/common/pullDownList'
export default {
  data(){
    return {
      isShowQueryResult: false,
      queryCondition:{
        organizationName: '',
      },
      titleData: [ '序号', '交易日期', '证券代码', '证券简称', '涨跌幅'],
      resultData: [
        {number: '测试标题', date: '2018-01-01', code: '000001', name: '证券简称', change: '-10%'},
        {number: '测试标题', date: '2018-01-01', code: '000001', name: '证券简称', change: '-10%'},
        {number: '测试标题', date: '2018-01-01', code: '000001', name: '证券简称', change: '-10%'},
        {number: '测试标题', date: '2018-01-01', code: '000001', name: '证券简称', change: '-10%'},
        {number: '测试标题', date: '2018-01-01', code: '000001', name: '证券简称', change: '-10%'},
        {number: '测试标题', date: '2018-01-01', code: '000001', name: '证券简称', change: '-10%'},
      ],
      organizationNameData: {
        title: '异动分类：', 
        titleWidth: 70,
        parentEvent: 'organizationNameEvent', 
        default: '请选择', 
        listWidth: 110, 
        nowSelectWidth: 110, 
        nowSelectHeight: 25, 
        nowSelectFontSize: 13,
        list:[
          '股价跌停',
          '大幅震荡',
        ]
      }
    }
  },
  components:{
    pullDownList,
  },
  methods:{
    organizationNameEvent(...data){
      this.queryCondition.organizationName = data[0];
    },
    query(){
      this.isShowQueryResult = true;
    }
  }
}
</script>

<style lang="less" scoped>
.queryConditionBox{
  width: 100%;
  height: 100px;
  margin-top: 10px;
  border-bottom: 1px solid #797979;
  .box{
    width: 700px;
    height: 130px;
    margin-left: 50px;
    position: relative;
    >div{
      float: left;
    }
    .stockCode{
      margin-left: 20px;
    }
    input{
      width: 110px;
      height: 25px;
      text-align: left;
      line-height: 25px;
    }
  }
  .queryBtn{
    position: absolute;
    right: 0px;
    top: 35px;
    width: 75px;
    height: 30px;
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
  }
}
</style>
