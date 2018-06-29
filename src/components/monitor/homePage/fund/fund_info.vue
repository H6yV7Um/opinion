<template>
  <div>
    <!-- 基金 > 基金情况 -->
    <div class="queryConditionBox clearFloat">
      <div class="queryCondition"> 
        基金代码： <input type="text" v-model="queryCondition.securityCode" @input="inputCode" placeholder="默认范围">
        <span v-if="isShowDropDownList" class="drop-down-box">
          <span v-for="(item, index) of dropDownList" :key="index" @click="dropDownEvent(item)">{{item}}</span>
        </span>
      </div>
      <div class="queryBtn">
        <span @click="query">查询</span>
      </div>
    </div>
    <!-- 基金信息 -->
    <div v-if="isShowCodeList" class="">
      <table>
        <thead>
          <tr>
            <th>基金代码</th>
            <th>基金名称</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) of nowCodeList" :key="index">
            <td>{{item.code}}</td>
            <td>{{item.name}}</td>
          </tr>
        </tbody>
      </table>
      <pagination :prop="paginationData" @paginationSelect="paginationSelect"></pagination>
    </div>
    <div v-if="querSuccess" style="border-bottom: 1px solid">
      <div class="informationBox clearFloat">
        <div class="informationLeft">
          <div>基金代码： {{fund_info.SECURITYCODE}}</div>
          <div>基金名称： {{fund_info.SECURITYNAME}}</div>
          <div>基金经理(现任）： {{fund_info.FMANAGER}}</div>
          <div v-if="fund_info.OFORCB == 1" class="openPopUp"><span @click="pur_red_type">申赎状态</span></div>
        </div>
        <div class="informationRigth">
          <div>基金简称： {{fund_info.SECURITYSNAME}}</div>
          <div>托管人： {{fund_info.TRUSTEE}}</div>
          <div class="openPopUp"><span @click="fund_manager">历任基金经理详情</span></div>
          <div v-if="fund_info.OFORCB == 1" class="openPopUp"><span @click="pur_red_info">申赎状态明细</span></div>
        </div>
      </div>
    </div>
    <div class="infoBox">
      <div v-if="infoType === 'pur_red_type'">
          <pur-red-type :prop="purRedTypeData"></pur-red-type>
      </div>
      <div v-else-if="infoType === 'fund_manager'">
        <fund-manager :prop="fundManagerData"></fund-manager>
      </div>
      <div v-else-if="infoType === 'pur_red_info'">
        <pur-red-info :prop="purRedInfoData"></pur-red-info>
      </div>
      <!-- <pop-up-con :prop="popUpData"></pop-up-con> -->
    </div>
  </div>
</template>

<script>
import pagination from '@/components/common/pagination'
import purRedType from '@/components/homePage/fund/pur_red_type';
import fundManager from '@/components/homePage/fund/fund_manager';
import purRedInfo from '@/components/homePage/fund/pur_red_info';
export default {
  data(){
    return {
      codeList: [],
      fundList: [],
      nowCodeList: [],
      nowCodeListPage: 1,
      dropDownList: [222,3333,4444,555],
      isShowDropDownList: false,
      querSuccess: false,
      isShowCodeList: false,
      infoType: '',
      popUpData: {},
      securityCode: '',
      queryCondition: {
        securityCode: '',
      },
      purRedTypeData: {},
      fundManagerData: {},
      purRedInfoData: {},
      paginationData: {
        parentEvent: 'paginationSelect',
        page_Count: 1,
        total_Count: 1,
        current: 1
      },
      fund_info:{
        SECURITYCODE: '',
        SECURITYNAME: '',
        SECURITYSNAME: '',
        FPROPERTY: '',
        FMANAGER: '',
        MANAGER: '',
        TRUSTEE: '',
        OFORCB: '',
      }
    }
  },
  components:{
    pagination,
    purRedType,
    fundManager,
    purRedInfo
  },
  computed:{
    popUpType(){
      return this.statePopUpData.type;
    },
    isShowPopUp:{
      get(){
        return this.$store.state.isShowPopUp;
      },
      set(newVal){
        this.$store.state.isShowPopUp = newVal;
      }
    }
  },
  methods:{
    inputCode(){
      let nowNumber = parseInt(this.queryCondition.securityCode);
      if(nowNumber.toString() === 'NaN' || nowNumber.toString() === 'Infinity' || nowNumber > 999999){
        this.queryCondition.securityCode = '';
      }
      if(this.queryCondition.securityCode.toString().length > 0){
        const tempArr = [];
        this.isShowDropDownList = true;
        this.codeList.forEach(item => {
          if(item.code.indexOf(this.queryCondition.securityCode.toString()) !== -1){
            tempArr.push(item.code + ' ' + item.name);
          }
        });
        this.dropDownList = tempArr.slice(0,5);
      }
    },
    dropDownEvent(item){
      this.queryCondition.securityCode = item;
      this.isShowDropDownList = false;
      this.securityCode = item.slice(0, item.indexOf(' '));
      console.log(item)
      console.log('securityCode', this.securityCode)
    },
    query(){
      if(this.queryCondition.securityCode === ''){
        this.querSuccess = false;
        this.isShowCodeList = true;
        this.nowCodeList = this.codeList.slice(0, 50);
      } else {
        if(this.queryCondition.securityCode === this.fund_info.SECURITYCODE) return;
        // this.securityCode = this.queryCondition.securityCode.slice(0, item.indexOf(' '));
        let errorCode = this.codeList.every(item => {
          return this.securityCode.slice(0,6).toString() != item.code;
        });
        if(errorCode){
          alert('基金代码不正确')
          return;
        }
        this.purRedTypeData = null;
        this.fundManagerData = null;
        this.purRedInfoData = null;

        this.querSuccess = true;
        this.isShowCodeList = false;
        this.infoType = '';
        let url = 'http://10.25.24.51:10192/api/rest/nlp/risk/fund_info?';
        let pur_red_type_url = 'http://10.25.24.51:10192/api/rest/nlp/risk/pur_red_type?';
        let fund_manager_url = 'http://10.25.24.51:10192/api/rest/nlp/risk/fund_manager?';
        let pur_red_info_url = 'http://10.25.24.51:10192/api/rest/nlp/risk/pur_red_info?';
        const _this = this;
        console.log(this.securityCode)
        console.log(this.queryCondition.securityCode)
        url = url + 'SECURITYCODE=' + this.securityCode.slice(0,6).toString();
        // 查询基金信息
        this.$_axios.get(url)
        .then(response => {
          console.log('查询基金信息',response);
          console.log(JSON.stringify(response.data))
          this.fund_info = response.data.result.fund_info;

          // 查询申赎状态
          pur_red_type_url = pur_red_type_url + 'SECURITYCODE=' + this.fund_info.SECURITYCODE;
          this.$_axios.get(pur_red_type_url)
          .then(response => {
            console.log('查询申赎状态',response);
            this.purRedTypeData = response.data.result;
            this.purRedTypeData.OFORCB = this.fund_info.OFORCB;
          })
          .catch(err => {
            console.log(err);
          });

          // 查询基金经理明细
          fund_manager_url = fund_manager_url + 'SECURITYCODE=' + this.fund_info.SECURITYCODE;
          this.$_axios.get(fund_manager_url)
          .then(response => {
            console.log('查询基金经理明细',response);
            this.fundManagerData = JSON.parse(JSON.stringify(response.data.result))
          })
          .catch(err => {
            console.log(err);
          });

          // // 查询申赎状态
          pur_red_info_url = pur_red_info_url + 'SECURITYCODE=' + this.fund_info.SECURITYCODE;
          this.$_axios.get(pur_red_info_url)
          .then(response => {
            console.log('查询申赎状态明细',response);
            console.log(JSON.stringify(response.data))
            this.purRedInfoData = response.data.result;
          })
          .catch(err => {
            console.log(err);
          });
        })
        .catch(err => {
          console.log(err);
        });
      }
    },
    // 申赎状态
    pur_red_type(){
      this.infoType = 'pur_red_type';
    },
    // 基金经理明细
    fund_manager(){
      this.infoType = 'fund_manager';
    },
    // 申赎明细
    pur_red_info(){
      this.infoType = 'pur_red_info';
    },
    paginationSelect(data){
      this.nowCodeListPage = data;
      this.nowCodeList = this.codeList.slice(this.nowCodeListPage * 50, (this.nowCodeListPage + 1) * 50);
    }
  },
  mounted(){
    this.$_axios.get('http://10.25.24.51:10191/api/rest/nlp/query_stock_list?stock_type=F')
      .then(response => {
        this.fundList = response.data.result.stock_list;
        // console.log(this.fundList)
        console.log(JSON.stringify(response.data))
        this.codeList = this.fundList.map(item => {
          return {
            code: item.slice(0,item.indexOf(' ')),
            name: item.slice(item.indexOf(' ') + 1)
          }
        });
        // paginationData.page_Count: 1,
        // paginationData.total_Count: 1,
        this.nowCodeList = this.codeList.slice(0, 50);
        this.paginationData.page_Count = Math.floor(this.codeList.length / 50)
        this.paginationData.total_Count = this.codeList.length;
        console.log(this.nowCodeList)
      })
      .catch(err => {
        console.log(err);
      });
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
  .queryCondition{
    position: relative;
    margin-left: 20px;
    .drop-down-box{
      position: absolute;
      top: 24px;
      left: 74px;
      width: 175px;
      border: 1px solid #797979;
      span{
        display: inline-block;
        width: 100%;
        height: 25px;
        line-height: 25px;
        cursor: pointer;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      span:hover{
        background-color: deepskyblue;
      }
    }
    input{
      width: 175px;
      height: 25px;
      text-align: left;
      line-height: 25px;
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
.informationBox{
  margin-top: 100px;
  margin-left: 100px;
}
.informationRigth,
.informationLeft{
  float: left;
  width: 350px;
  >div{
    width: 100%;
    float: left;
    line-height: 30px;
  }
}
.openPopUp{
  span{
    cursor: pointer;
    text-decoration: underline;
  }
}
table{
    margin-top: 20px;
    border: 1px solid #797979;
    border-collapse: collapse;
    word-wrap: break-word;
    word-break: break-all;
    th{
      border: 1px solid #797979;
      height: 40px;
      line-height: 40px;
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
</style>
