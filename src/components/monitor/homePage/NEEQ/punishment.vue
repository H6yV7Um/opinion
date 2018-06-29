<template>
  <div>
    <!-- 新三板 监管公开信息 > 纪律处分 -->
    <div>
      <div class="top">
        <div class="title">
          纪律处分
        </div>
        <div class="link">
          首页 > 信息披露 > 监管公开信息 > 纪律处分
        </div>
      </div>
      <div class="middle">
        <div>
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
        <div>
          关键字：<input type="text">
        </div>
        <div class="queryBtn">
          <span @click="query">查询</span>
        </div>
        <div class="execl">
          <span @click="exportExecl()" class="execlText">导出Execl</span>
          <span></span>
        </div>
      </div>
      <div v-if="isQueryResult" class="queryResult">
        <table id="ta">
          <tbody>
            <tr>
              <th v-for="(item, index) of tableData.th" 
                  :key="index" class="title">
                  {{item}}
              </th>
            </tr>
            <tr v-for="(item, index) of tableData.tr" 
                :key="index">
                <td>{{item.news_date}}</td>
                <td>{{item.news_title}}</td>
                <td>
                  <span v-for="(secondItem, secondIndex) of item.news_subject" :key="secondIndex" class="portionSpan">{{secondItem}}</span>
                </td>
                <td>
                  <span v-for="(secondItem, secondIndex) of item.subject_legal_status" :key="secondIndex" class="portionSpan">{{secondItem}}</span>
                </td>
                <td>
                  <span v-for="(secondItem, secondIndex) of item.disci_punishment" :key="secondIndex" class="portionSpan">{{secondItem}}</span>
                </td>
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
      url: 'http://10.25.24.51:10189/api/risk/neeq_pub_info2?',
      isQueryResult: false,
      queryCondition:{
        keyword: '',
        start_date: '',
        end_date: '',
        news_date: '',
        page: 0,
        page_size: 10
      },
      sendData: {},
      paginationData:{
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
        th:['日期', '监管公告', '责任主体', '主体法律身份', '纪律处分'],
        tr: [
          {news_date: '2017-09-07', news_title: '关于给予唐山处分的决定', news_subject:['监管公告', '责任主体'], subject_legal_status: ['监管公告', '责任主体'], disci_punishment: ['监管公告', '责任主体']}
        ]
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
      console.log('sendData', this.sendData)
      let url = this.url 
        // + 'start_date=&end_date=&keyword=天利和&news_date=&page=0&pagesize=10'
        + 'page=' + this.sendData.page + '&'
        + 'pagesize=' + this.sendData.page_size + '&'
        + 'start_date=' + this.sendData.start_date + '&'
        + 'end_date=' + this.sendData.end_date + '&'
        + 'news_date=' + this.sendData.news_date + '&'
        + 'keyword=' + this.sendData.keyword;
      this.$_axios.get(url)
      .then(response => {
        const resultData = response.data.result;
        this.isQueryResult = true;
        console.log('监管公开信息-纪律处分', resultData);
        this.tableData.tr = JSON.parse(JSON.stringify(resultData.neeq_news));
        this.paginationData.total_Count = resultData.total_count;
        this.paginationData.page_Count = Math.ceil(resultData.total_count / 10);
        this.tableData.tr.forEach(item => {
          item.news_subject = item.news_subject.split('&');
          item.subject_legal_status = item.subject_legal_status.split('&');
          item.disci_punishment = item.disci_punishment.split('&');
        });
      })
      .catch(err => {
        console.log(err);
      });
    },
    paginationSelect(pageNumber){
      const sendData = JSON.parse(JSON.stringify(this.sendData));
      let url = this.url 
        // + 'start_date=&end_date=&keyword=天利和&news_date=&page=0&pagesize=10'
        + 'page=' + (pageNumber -1) + '&'
        + 'pagesize=' + sendData.page_size + '&'
        + 'start_date=' + sendData.start_date + '&'
        + 'end_date=' + sendData.end_date + '&'
        + 'news_date=' + sendData.news_date + '&'
        + 'keyword=' + sendData.keyword;
      this.$_axios.get(url)
      .then(response => {
        this.isQueryResult = true;
        console.log('监管公开信息-纪律处分', response);
        this.tableData.tr = JSON.parse(JSON.stringify(response.data.result.neeq_news));
        this.tableData.tr.forEach(item => {
          item.news_subject = item.news_subject.split('&');
          item.subject_legal_status = item.subject_legal_status.split('&');
          item.disci_punishment = item.disci_punishment.split('&');
        });
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
    exportExecl(){
      if(!this.isQueryResult) return;
      function getExplorer() {
        let explorer = window.navigator.userAgent;
        //ie
        if (explorer.indexOf("MSIE") >= 0) {
          return 'ie';
        }
        //firefox
        else if (explorer.indexOf("Firefox") >= 0) {
          return 'Firefox';
        }
        //Chrome
        else if (explorer.indexOf("Chrome") >= 0) {
          return 'Chrome';
        }
        //Opera
        else if (explorer.indexOf("Opera") >= 0) {
          return 'Opera';
        }
        //Safari
        else if (explorer.indexOf("Safari") >= 0) {
          return 'Safari';
        }
      }
      function method1(tableid) { //整个表格拷贝到EXCEL中
        if (getExplorer() == 'ie') {
          var curTbl = document.getElementById(tableid);
          var oXL = new ActiveXObject("Excel.Application");
          console.log(222)
          //创建AX对象excel
          var oWB = oXL.Workbooks.Add();
          //获取workbook对象
          var xlsheet = oWB.Worksheets(1);
          //激活当前sheet
          var sel = document.body.createTextRange();
          sel.moveToElementText(curTbl);
          //把表格中的内容移到TextRange中
          sel.select;
          //全选TextRange中内容
          sel.execCommand("Copy");
          //复制TextRange中内容
          xlsheet.Paste();
          //粘贴到活动的EXCEL中
          oXL.Visible = true;
          //设置excel可见属性

          try {
            var fname = oXL.Application.GetSaveAsFilename("Excel.xls", "Excel Spreadsheets (*.xls), *.xls");
          } catch (e) {
            print("Nested catch caught " + e);
          } finally {
            oWB.SaveAs(fname);

            oWB.Close(savechanges = false);
            //xls.visible = false;
            oXL.Quit();
            oXL = null;
            //结束excel进程，退出完成
            //window.setInterval("Cleanup();",1);
            idTmr = window.setInterval("Cleanup();", 1);
          }
        } else {
          tableToExcel('ta')
        }
      }
      function Cleanup() {
        window.clearInterval(idTmr);
        CollectGarbage();
      }
      var tableToExcel = (function () {
      var uri = 'data:application/vnd.ms-excel;base64,',
        template =
        '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
        base64 = function (s) {
          return window.btoa(unescape(encodeURIComponent(s)))
        },
        // 下面这段函数作用是：将template中的变量替换为页面内容ctx获取到的值
        format = function (s, c) {
          return s.replace(/{(\w+)}/g,
            function (m, p) {
              return c[p];
            }
          )
        };
        return function (table, name) {
          if (!table.nodeType) {
            table = document.getElementById(table)
          }
          // 获取表单的名字和表单查询的内容
          var ctx = {
            worksheet: name || 'Worksheet',
            table: table.innerHTML
          };
          // format()函数：通过格式操作使任意类型的数据转换成一个字符串
          // base64()：进行编码
          window.location.href = uri + base64(format(template, ctx))
        }
      })()
      method1('ta');
    }
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
    margin-left: 20px;
  }
  input{
    width: 130px;
    height: 25px;
    font: 400 13px/25px Arial;
  }
  .queryBtn{
    margin-left: 45px;
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
    width: 100px;
    height: 30px;
    margin-left: 45px;
    border: 1px solid #797979;
    background-color: #fff;
    line-height: 30px;
    cursor: pointer;
    .execlText{
      margin-left: 15px;
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
    // display: table-row-group;
    vertical-align: middle;
    border-color: inherit;
    border-collapse: collapse;
    word-wrap: break-word;
    word-break: break-all;
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
    }
    .portionSpan{
      display: block;
      width: 100%;
      line-height: 25px;
      border-top: 1px solid #797979;
    }
    .portionSpan:nth-child(1){
      border-top: none;
    }
    .title:nth-child(1){
      width: 130px;
    }
    .title:nth-child(3){
      width: 100px;
    }
    .title:nth-child(4){
      width: 240px;
    }
  }
}
</style>
