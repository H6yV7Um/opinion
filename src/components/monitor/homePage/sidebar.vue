<template>
    <div class="homePageSidebar clearFloat">
        <!-- 第一级循环 -->
        <div v-for="(item,index) of prop" 
            :key="index">
            <div v-if="item.list.length === 0" class="firstTitle" 
                :class="{showChildList: item.isShowList || item.lastChild}">
                <router-link @click.native="routerGoNow" :to="item.path">{{item.title}}</router-link>
            </div>
            <div v-else class="firstTitle" 
                @click="showList(item)"
                :class="{showChildList: item.isShowList || item.lastChild}">
                {{item.title}}
            </div>
            <ul v-show="item.isShowList">
                <!-- 第二级循环 -->
                <li v-for="(secondItem,secondIndex) of item.list" 
                    :key="secondIndex" 
                    class="secondList">
                    <div v-if="secondItem.list.length">
                        <div class="secondTitle" 
                            :class="{showChildList: secondItem.isShowList, secondTitleFirst: secondIndex === 0, wordWrapping: secondItem.wordWrapping}"
                             @click="showList(secondItem)">
                             {{secondItem.title}}
                        </div>
                        <ul v-show="secondItem.isShowList">
                            <!-- 第三级循环 -->
                            <li  v-for="(thirdItem,thirdIndex) of secondItem.list" 
                                :key="thirdIndex">
                                <div class="thirdTitle" :class="{wordWrapping: thirdItem.wordWrapping}">
                                    <router-link @click.native="routerGoNow" :to="thirdItem.path">{{thirdItem.title}}</router-link>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div v-else class="secondTitle" :class="{wordWrapping: secondItem.wordWrapping}">
                        <router-link @click.native="routerGoNow" :to="secondItem.path">{{secondItem.title}}</router-link>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    props: ['prop'],
    data(){
        return {
            isShowList: false,
        }
    },
    computed:{
        // isShowList:{
        //     get(){
        //         return this.prop.isShowList;
        //     },
        //     set(){
        //         this.prop.isShowList = !this.prop.isShowList;
        //     }
        // }
    },
    methods:{
        showList(item){
            item.isShowList = !item.isShowList;
        },
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
.homePageSidebar{
    float: left;
    width: 198px;
    margin-top: 45px;
    margin-left: 50px;
    // border: 1px solid #797979;
    .router-link-active{
        color: #6acdfd !important;
    }
    .firstTitle{
        font: 14px/45px Arial;
        border-top: 1px solid #797979;
        border-left: 1px solid #797979;
        border-right: 1px solid #797979;
        background-color: #CC0000;
        >a{
            display: inline-block;
            width: 100%;
            min-height: 40px;
            color: #FFFFFF;
            text-decoration:none;
        }
    }
    .firstTitle:hover{
        background-color: #6acdfd;
    }
    .secondTitle{
        width: 170px;
        border-left: 1px solid #797979;
        border-right: 1px solid #797979;
        border-top: 1px solid #797979;
        margin-left: 26px;
        >a{
            display: inline-block;
            width: 100%;
            min-height: 40px;
            color: #000000;
            text-decoration:none;
        }
        >a:hover{
            color: #6acdfd;
        }
    }
    .secondTitleFirst{
        border-top: none;
    }
    .secondTitle:hover{
        color: #6acdfd;
    }
    .thirdTitle{
        width: 160px;
        text-align: center;
        // border: 1px solid red;
        margin-left: 36px;
        a{
            display: inline-block;
            width: 100%;
            min-height: 40px;
            color: #000000;
            text-decoration:none;
        }
    }
    >div{
        float: left;
        width: 198px;
        color: #FFFFFF;
        text-align: center;
        cursor: pointer;
        .secondList{
            float: left;
            width: 170px;
            font: 13px/40px Arial;
            color: #333333;
        }
        .secondList:nth-child(1){
            .secondTitle{
                border-top: none;
            }
        }
        .wordWrapping{
            font: 13px/18px Arial;
        }
    }
}
.showChildList{
    border-bottom: 1px solid #797979;
}
.showSecondChildList{
    border-bottom: 1px solid #797979;
}
</style>
