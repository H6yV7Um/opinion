<template>
  <div class="sidebarContent">
    <div class="queryCondition">
      <span>新闻日期：</span>
      <input type="text">
      <span>至</span>
      <input type="text">
      <span class="significanceBefore">重要性：</span>
      <input class="significance" type="text" placeholder="默认范围">
      <span class="queryConditionBtn">查询</span>
      <br>
      <span class="riskTypeBefore">风险类别：</span>
      <!-- 风险类别下拉 -->
      <span class="riskTypeDown" @click="showRiskTypeList">
        {{nowRiskType}}
        <i class="iconfont icon-triangle-bottom"></i>
        <span v-show="isShowRiskTypeList" class="riskTypeDownBox">
          <span v-for="(item,index) of riskTypeList" 
            :key="index" 
            @click="checkRiskType(item)" class="riskType">
            {{item}}
          </span>
        </span>
      </span>
    </div>
      <div class="featureBox clearFloat">
        <div class="uploadFiles">上传文件(csv、excel)等</div>
        <div class="feature clearFloat">
          <div>加入收藏夹</div>
          <div>设置重点关注池</div>
        </div>
      </div>
      <div v-if="isShowCustomType" class="customTypeListBox">
        <div class="customTypeListFirst">
          <ul class="clearFloat">
            <li class="allType firstType">
              <span @click="checkAllType" class="typeIconBox"><i v-show="isCheckAll" class="iconfont icon-queren"></i></span>
              <span>全部</span>
            </li>
            <br>
            <li class="firstType" v-for="(item,index) of customType" 
              :key="index" >
              <span @click="checkType(item)" class="typeIconBox"><i v-show="item.isCheck" class="iconfont icon-queren"></i></span>
              <span>{{item.title}}</span>
            </li>
          </ul>
        </div>
        <div class="CustomTypeListSecond"></div>
        <div></div>
    </div>
  </div>
</template>

<script>
export default {
    data(){
        return {
            // 是否显示风险类型下拉列表
            isShowRiskTypeList: false,
            isShowCustomType: false,
            isCheckAll: false,
            nowRiskType: '按风险大类',
            riskTypeList: ['按风险大类', '按风险小类', '自定义'],
            customType: [ 
                {title: '信用风险', isCheck: false},
                {title: '市场风险', isCheck: false},
                {title: '财务风险', isCheck: false},
                {title: '经营风险', isCheck: false},
                {title: '管理风险', isCheck: false},
                {title: '项目风险', isCheck: false},
                {title: '担保风险', isCheck: false},
                {title: '不可抗力风险', isCheck: false},
                {title: '监管预警', isCheck: false},
                {title: '产品预警', isCheck: false},
                {title: '其他风险', isCheck: false}
            ]
        }
    },
    methods:{
        // 点击是否显示风险类型下拉列表
        showRiskTypeList(){
            this.isShowRiskTypeList = !this.isShowRiskTypeList;
        },
        // 点击选择风险类型
        checkRiskType(item){
            console.log(item)
            this.nowRiskType = item;
            if(item === '自定义'){
                this.isShowCustomType = true;
            } else {
                this.isShowCustomType = false;
            }
        },
        // 选择全部风险类型
        checkAllType(){
            this.isCheckAll = !this.isCheckAll;
            this.customType.forEach(item => {
                item.isCheck = this.isCheckAll;
            });
        },
        checkType(item){
            item.isCheck = !item.isCheck;
            this.isCheckAll = false;
        }
    }
}
</script>

<style lang="less" scoped>
.customTypeListFirst{
    width: 800px;
    margin-left: 230px;
    margin-top: 50px;
    font-size: 12px;
    .firstType{
        float: left;
        margin-left: 40px;
    }
    .typeIconBox{
        position: relative;
        display: inline-block;
        width: 11px;
        height: 11px;
        background-color: #fff;
        border: 1px solid #797979;
        border-radius: 2px;
        margin-right: 20px;
        .icon-queren{
            position: absolute;
            top: -2px;
            left: -7px;
        }
    }
}
.sidebarContent{
    float: left;
}
.queryCondition{
  margin-top: 100px;
  margin-left: 70px;
  padding-left: 100px;
  padding-right: 150px;
  input{
    width: 120px;
    height: 26px;
  }
  .significanceBefore{
    display: inline-block;
    margin-left: 10px;
  }
  .riskTypeDown{
    position: relative;
    width: 144px;
    height: 22px;
    line-height: 22px;
    cursor: pointer;
    display: inline-block;
    border: 1px solid #797979;
    .riskTypeDownBox{
      position: absolute;
      top: 22px;
      left: 0px;
      display: inline-block;
      width: 144px;
      border: 1px solid #797979;
    }
    .riskType{
      display: inline-block;
      width: 144px;
      cursor: pointer;
      background: #FFFFFF;
    }
    .riskType:hover{
      background-color: #6acdfd;
    }
    .icon-triangle-bottom{
      position: absolute;
      top: 0px;
      right: 3px;
    }
  }
  .riskTypeBefore{
    display: inline-block;
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .queryConditionBtn{
    display: inline-block;
    width: 70px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    margin-left: 50px;
    border: 1px solid rgb(121,121,121);
    border-radius: 8px;
    cursor: pointer;
  }
}
.featureBox{
  padding-left: 100px;
  margin-left: 70px;
  padding-bottom: 20px;
  border-bottom: 1px solid #797979;
  .uploadFiles{
    float: left;
  }
.feature{
    float: right;
    >div{
      float: left;
      margin-left: 20px;
    }
  }
}
</style>
