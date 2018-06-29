<template>
  <div class="blackSwanBox clearFloat">
    <!-- 黑天鹅 -->
    <div class="sidebarBox">
      <ul>
        <li v-for="(item, index) of sidebarData" :key="index">
          <router-link @click.native="routerGoNow" :to="item.path">{{item.title}}</router-link>
        </li>
      </ul>
    </div>
    <div v-if="isRouterGoNow" class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      sidebarData: [
        {title: '退市警示', path: '/blackSwan/delistingWarning'},
        {title: '高管离职', path: '/blackSwan/executives'},
        {title: '国际国内重大事件', path: '/blackSwan/importantEvent'},
      ]
    }
  },
  computed:{
    isRouterGoNow(){
      return this.$store.state.routerGoNow;
    }
  },
  methods:{
    routerGoNow(){
        // this.$router.go(0)
        // console.log(2222)
        this.$store.state.routerGoNow = false;
        let timer = window.setInterval(()=>{
            this.$store.state.routerGoNow = true;
            window.clearInterval(timer)
            // console.log(0)
        },0);
    }
  }
}
</script>

<style lang="less" scoped>
.blackSwanBox{
  width: 1500px;
}
.sidebarBox{
  float: left;
  width: 198px;
  margin-top: 48px;
  margin-left: 50px;
  border: 1px solid #797979;
  li{
    width: 100%;
    height: 46px;
    line-height: 46px;
    text-align: center;
    border-bottom: 1px solid #797979;
    a{
      display: inline-block;
      width: 100%;
      height: 100%;
      color: #fff;
      text-decoration: none;
      background-color: #CC0000;
    }
  }
  li:nth-last-child(1){
    border-bottom: none;
  }
}
.content{
  float: left;
  width: 1180px;
  margin-top: 50px;
  margin-left: 65px;
}
</style>
