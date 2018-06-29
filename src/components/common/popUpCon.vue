<template>
  <div>
    <div class="popUpBox">
      <div class="popUpBoxBg"></div>
      <div class="popUp">
        <!-- <pop-up-con></pop-up-con> -->
        <div v-if="popUpType === 'pur_red_type'">
          <pur-red-type></pur-red-type>
        </div>
        <div v-else-if="popUpType === 'fund_manager'">
          <fund-manager></fund-manager>
        </div>
        <div v-else-if="popUpType === 'pur_red_info'">
          <pur-red-info></pur-red-info>
        </div>
        <span @click="closePopUp" class="closeBtn">×</span>
        <span v-if="isShowPreviousBtn" @click="previous" class="previous iconfont icon-jiantouzuo"></span>
        <span v-if="isShowNextBtn" @click="next" class="next iconfont icon-jiantouyou"></span>
      </div>
    </div>
  </div>
</template>

<script>
import purRedType from '@/components/homePage/fund/pur_red_type';
import fundManager from '@/components/homePage/fund/fund_manager';
import purRedInfo from '@/components/homePage/fund/pur_red_info';
export default {
  props: ['prop'],
  computed:{
    statePopUpData(){
      return this.$store.state.popUpData;
    },
    popUpType(){
      return this.statePopUpData.type;
    },
    nowIndex(){
      return this.statePopUpData.nowIndex;
    },
    isShowPreviousBtn:{
      get(){
        return this.statePopUpData.isShowPreviousBtn;
      },
      set(newVal){
        this.statePopUpData.isShowPreviousBtn = newVal;
      }
    },
    isShowNextBtn:{
      get(){
        return this.statePopUpData.isShowNextBtn;
      },
      set(newVal){
        this.statePopUpData.isShowNextBtn = newVal;
      }
    }
  },
  watch:{
    nowIndex(newVal, oldVal){
      if(newVal <= 0){
        this.isShowPreviousBtn = false;
        this.isShowNextBtn = true;
      } else if(newVal > 0 && newVal < this.statePopUpData.popUpDataLength -1){
        this.isShowPreviousBtn = true;
        this.isShowNextBtn = true;
      } else {
        this.isShowPreviousBtn = true;
        this.isShowNextBtn = false;
      }
    }
  },
  components:{
    purRedType,
    fundManager,
    purRedInfo
  },
  methods:{
    closePopUp(){
      this.$store.state.isShowPopUp = false;
      this.isShowPreviousBtn = false;
      this.isShowNextBtn = false;
      this.statePopUpData.nowIndex = 0;
      this.statePopUpData.translateData = 0;
      // this.statePopUpData = null;
    },
    previous(){
      const popUpData = this.statePopUpData;
      popUpData.nowIndex--;
      if(popUpData.nowIndex < 0){
        popUpData.nowIndex = 0;
      }
      popUpData.translateData = -900 * popUpData.nowIndex;
    },
    next(){
      const popUpData = this.statePopUpData;
      popUpData.nowIndex++;
      if(popUpData.nowIndex >= popUpData.popUpDataLength){
        popUpData.nowIndex = popUpData.popUpDataLength -1;
        this.isShowPreviousBtn = true;
      }
      popUpData.translateData = -900 * popUpData.nowIndex;
    }
  },
  mounted(){
    if(this.statePopUpData.popUpDataLength == 1){
        this.isShowPreviousBtn = false;
        this.isShowNextBtn = false;
      }
  }
}
</script>

<style lang="less" scoped>
.popUpBox{
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: 2;
  .popUpBoxBg{
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: rgba(32,192,252, 0.1);
    z-index: 1;
  }
  .popUp{
    position: absolute;
    top: 130px;
    left: 260px;
    width: 1120px;
    height: 640px;
    // background-color: rgba(32,192,252, 1);
    background-color: #fff;
    border: 1px solid #797979;
    z-index: 3;
  }
  .previous,
  .next{
    display: inline-block;
    position: absolute;
    top: 240px;
    font-size: 35px;
    cursor: pointer;
    z-index: 3;
  }
  .previous{
    left: 10px;
  }
  .next{
    right: 10px;
  }
  .closeBtn{
    display: inline-block;
    position: absolute;
    top: 20px;
    right: 20px;
    font-size: 30px;
    cursor: pointer;
    z-index: 3;
  }
}
</style>
