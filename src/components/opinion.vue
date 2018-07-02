<template>
  <div>
    <div class="opinionTop">
      <div class="logo">
        <router-link to="/"></router-link>
      </div>
      <div class="middle">

      </div>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
.opinionTop{
  position: relative;
  width: 100%;
  height: 60px;
  .logo{
    position: absolute;
    top: 5px;
    left: 20px;
    width: 190px;
    height: 48px;
    background-image: url("../assets/logo.png");
  }
  a{
    display: inline-block;
    width: 100%;
    height: 100%;
  }
}
</style>
