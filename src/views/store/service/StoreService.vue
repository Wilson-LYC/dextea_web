<style scoped>
@import './StoreService.css';
</style>
<template>
  <div class="window">
    <div class="olist">
      <el-tabs style="height:100%;">
        <el-tab-pane label="已下单">
          <el-scrollbar class="olist-scrollbar">
            <div v-if="payLsit.length < 1" style="color: #999999;">无数据</div>
            <div class="oitem" v-for="(it, index) in payLsit" @click="clickItem(it)">
              <div style="font-size: 14px;color: #999999;line-height: 20px;">下单时间：{{ it.createtime }}</div>
              <el-row>
                <el-col :span="8">
                  <div>
                    <div style="font-size: 28px;font-weight: bold;line-height: 50px;">{{ it.code }}</div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div v-if="it.num > 0">
                    <div style="font-size: 28px;font-weight: bold;line-height: 50px;">×{{ it.num }}</div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div style="text-align: center;line-height: 50px;">
                    <el-button type="warning" @click="updateState(it.id, '2')">开始制作</el-button>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane label="制作中">
          <el-scrollbar class="olist-scrollbar">
            <div v-if="makeLsit.length < 1" style="color: #999999;">无数据</div>
            <div class="oitem" v-for="(it, index) in makeLsit" @click="clickItem(it)">
              <div style="font-size: 14px;color: #999999;line-height: 20px;">下单时间：{{ it.createtime }}</div>
              <el-row>
                <el-col :span="8">
                  <div>
                    <div style="font-size: 28px;font-weight: bold;line-height: 50px;">{{ it.code }}</div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div v-if="it.num > 0">
                    <div style="font-size: 28px;font-weight: bold;line-height: 50px;">×{{ it.num }}</div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div style="text-align: center;line-height: 50px;">
                    <el-button type="primary" @click="updateState(it.id, '3')">制作完成</el-button>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane label="待取茶">
          <el-scrollbar class="olist-scrollbar">
            <div v-if="waitLsit.length < 1" style="color: #999999;">无数据</div>
            <div class="item" v-for="(it, index) in waitLsit" @click="clickItem(it)">
              <div style="font-size: 14px;color: #999999;line-height: 20px;">下单时间：{{ it.createtime }}</div>
              <el-row>
                <el-col :span="8">
                  <div>
                    <div style="font-size: 28px;font-weight: bold;line-height: 50px;">{{ it.code }}</div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div v-if="it.num > 0">
                    <div style="font-size: 28px;font-weight: bold;line-height: 50px;">×{{ it.num }}</div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div style="text-align: center;line-height: 50px;">
                    <el-button type="primary" @click="updateState(it.id, '4')">已取餐</el-button>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane label="已完成">
          <el-scrollbar class="olist-scrollbar">
            <div v-if="finishLsit.length < 1" style="color: #999999;">无数据</div>
            <div class="item" v-for="(it, index) in finishLsit" @click="clickItem(it)">
              <div style="font-size: 14px;color: #999999;line-height: 20px;">下单时间：{{ it.createtime }}</div>
              <el-row>
                <el-col :span="8">
                  <div>
                    <div style="font-size: 28px;font-weight: bold;line-height: 50px;">{{ it.code }}</div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div v-if="it.num > 0">
                    <div style="font-size: 28px;font-weight: bold;line-height: 50px;">×{{ it.num }}</div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div style="text-align: center;line-height: 50px;">
                    <!-- <el-button type="primary">制作完成</el-button> -->
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane label="退单">
          <el-scrollbar class="olist-scrollbar">
            <div v-if="payLsit.length < 1" style="color: #999999;">无数据</div>
            <div class="oitem" v-for="(it, index) in cancelList" @click="clickItem(it)">
              <div style="font-size: 14px;color: #999999;line-height: 20px;">下单时间：{{ it.createtime }}</div>
              <el-row>
                <el-col :span="8">
                  <div>
                    <div style="font-size: 28px;font-weight: bold;line-height: 50px;">{{ it.code }}</div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div v-if="it.num > 0">
                    <div style="font-size: 28px;font-weight: bold;line-height: 50px;">×{{ it.num }}</div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div style="text-align: center;line-height: 50px;">
                    <el-button type="warning" @click="updateState(it.id, '2')">开始制作</el-button>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane label="所有订单">
          <el-scrollbar class="olist-scrollbar">
            <div v-if="allList.length < 1" style="color: #999999;">无数据</div>
            <div class="oitem" v-for="(it, index) in allList" @click="clickItem(it)">
              <div style="font-size: 14px;color: #999999;line-height: 20px;">下单时间：{{ it.createtime }}</div>
              <el-row>
                <el-col :span="8">
                  <div>
                    <div style="font-size: 28px;font-weight: bold;line-height: 50px;">{{ it.code }}</div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div v-if="it.num > 0">
                    <div style="font-size: 28px;font-weight: bold;line-height: 50px;">×{{ it.num }}</div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div style="text-align: center;line-height: 50px;">
                    <div>
                      <el-button type="warning" @click="updateState(it.id, '2')" v-if="it.state == '1'">开始制作</el-button>
                    </div>
                    <div>
                      <el-button type="primary" @click="updateState(it.id, '3')" v-if="it.state == '2'">制作完成</el-button>
                    </div>
                    <div>
                      <el-button type="success" @click="updateState(it.id, '4')" v-if="it.state == '3'">已取餐</el-button>
                    </div>
                    <div>
                      <el-button type="danger" @click="cancelOrder(it.id, '0')" v-if="it.state == '1'">取消订单</el-button>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-scrollbar>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="odetail">
      <div v-if="oid != ''">
        <div class="btn" style="margin-bottom: 20px;">
          <el-button type="info" @click="updateState(order.id, '1')">已下单</el-button>
          <el-button type="warning" @click="updateState(order.id, '2')">开始制作</el-button>
          <el-button type="primary" @click="updateState(order.id, '3')">制作完成</el-button>
          <el-button type="success" @click="updateState(order.id, '4')">已取餐</el-button>
          <el-button type="danger" @click="cancelOrder(order.id, '0')">取消订单</el-button>
        </div>
        <el-form :model="order" ref="myform" :rules="rules" label-position="right" label-width="80px" size="default">
          <el-form-item label="订单ID" prop="id">
            <el-input v-model="order.id" type="text" disabled></el-input>
          </el-form-item>
          <el-form-item label="订单进度" prop="state">
            <el-select v-model="order.state" class="full-width-input" placeholder="请选择" style="width: 100%;" disabled>
              <el-option v-for="(item, index) in orderStateOptions" :key="index" :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="门店" prop="storeName">
            <el-input v-model="order.storeName" type="text" disabled></el-input>
          </el-form-item>
          <el-form-item label="顾客昵称" prop="custName">
            <el-input v-model="order.custName" type="text" disabled></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model="order.phone" type="text" disabled></el-input>
          </el-form-item>
          <el-form-item label="总消费" prop="price">
            <el-input v-model="order.price" type="text" disabled></el-input>
          </el-form-item>
          <el-form-item label="总数量" prop="num">
            <el-input v-model="order.num" type="text" disabled></el-input>
          </el-form-item>
          <el-form-item label="订单备注" prop="num">
            <el-input v-model="order.note" type="textarea" :autosize="{ minRows: 3, maxRows: 3 }" disabled></el-input>
          </el-form-item>
          <el-form-item label="下单时间" prop="phone">
            <el-input v-model="order.createtime" type="text" disabled></el-input>
          </el-form-item>
          <el-form-item label="更新时间" prop="phone">
            <el-input v-model="order.updatetime" type="text" disabled></el-input>
          </el-form-item>
        </el-form>
        <div class="btn" style="margin-bottom: 5px;">
          <el-button @click="this.oid = ''">取消选择</el-button>
        </div>
      </div>
      <div v-else style="text-align: center;">
        <img src="@/assets/img/logo.png" style="width: 200px;margin-top: 300px;">
        <!-- <div>在线点单系统</div> -->
      </div>
    </div>
    <div class="otable">
      <el-table :data="order.commodity" border class="mytable" table-layout="auto" v-if="oid != ''">
        <template #empty>无数据</template>
        <!-- 数据部分 -->
        <el-table-column prop="name" label="商品" width="200" fixed="left" :show-overflow-tooltip="true" class="mytable" />
        <el-table-column label="个性化定制" :show-overflow-tooltip="true">
          <template #default="scoped">
            <div v-for="ocit in scoped.row.custom">{{ ocit.item }}：{{ ocit.value }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="单价" width="100" :show-overflow-tooltip="true" />
        <el-table-column prop="num" label="数量" width="100" :show-overflow-tooltip="true" />
      </el-table>
      <div v-else style="text-align: center;">
        <img src="@/assets/img/logo.png" style="width: 200px;margin-top: 300px;">
        <!-- <div>在线点单系统</div> -->
      </div>
    </div>
  </div>
</template>
<script>
import { ElMessage, ElNotification } from 'element-plus'
export default {
  data() {
    return {
      scoket: '',
      order: {},
      payLsit: [],
      makeLsit: [],
      waitLsit: [],
      finishLsit: [],
      cancelList: [],
      allList: [],
      oid: "",
      //订单状态选项
      orderStateOptions: [{
        value: "1",
        label: "已下单"
      }, {
        value: "2",
        label: "制作中"
      }, {
        value: "3",
        label: "待取茶"
      }, {
        value: "4",
        label: "已完成"
      }, {
        value: "0",
        label: "退单"
      }]
    }
  },
  unmounted() {
    this.socket.close()
  },
  mounted() {
    this.checkStoreState();
    this.init();
    this.getData();
  },
  methods: {
    //websocket相关
    //初始化
    init: function () {
      let url = this.$wsurl + "/ws/service/";
      let sid = sessionStorage.getItem('storeId')
      if (typeof (WebSocket) === "undefined") {
        ElMessage.error("您的浏览器不支持socket服务")
      } else {
        // 实例化socket
        this.socket = new WebSocket(url + sid)
        // 监听socket连接
        this.socket.onopen = this.open
        // 监听socket错误信息
        this.socket.onerror = this.error
        // 监听socket消息
        this.socket.onmessage = this.getMessage
        //每隔50秒发送一次ping
        setInterval(() => {
          this.socket.send("ping")
        }, 50000)
      }
    },
    open: function () {
      ElMessage.success("门店服务已连接")
    },
    error: function () {
      ElMessage.error("门店服务连接异常")
    },
    //接收服务器发来的消息
    getMessage: function (e) {
      if (e.data == "pong") {
        return
      }
      let data = JSON.parse(e.data)
      if (data.type == 'message') {
        let content = data.content
        this.notify(content.type, content.title, content.message)
      } else if (data.type == 'order') {
        let order = data.content
        this.payLsit = order.s1
        this.makeLsit = order.s2
        this.waitLsit = order.s3
        this.finishLsit = order.s4
        this.cancelList = order.s0
        this.allList = this.payLsit.concat(this.makeLsit, this.waitLsit, this.finishLsit, this.cancelList)
      } else {
        console.log(data)
        ElMessage.error("收到消息但未知类型，请前往控制台查看")
      }
    },
    //业务相关
    clickItem(val) {
      this.oid = val.id
    },
    getOrderList() {
      let sid = sessionStorage.getItem('storeId')
      //get请求
      this.$http.get("/v1/service/order/today?id=" + sid).then(
        (response) => {
          if (response.data.code != 200) {
            ElMessage.error(response.data.msg)
            return
          }
          this.payLsit = response.data.data.order.s1
          this.makeLsit = response.data.data.order.s2
          this.waitLsit = response.data.data.order.s3
          this.finishLsit = response.data.data.order.s4
          this.cancelList = response.data.data.order.s0
          this.allList = this.payLsit.concat(this.makeLsit, this.waitLsit, this.finishLsit, this.cancelList)
        }
      )
    },
    getData() {
      this.getOrderList()
    },
    updateState(id, state) {
      this.$emit('update:change', (this.change + 1) % 10)
      //从sessionStorage中获取sid
      let sid = sessionStorage.getItem('storeId')
      //get请求
      this.$http.get("/v1/service/order/update/state", {
        params: {
          oid: id,
          state: state,
          sid: sid
        }
      }).then(
        (response) => {
          if (response.data.code != 200) {
            ElMessage.error(response.data.msg)
            return
          }
        }
      )
    },
    notify(type, title, message) {
      ElNotification({
        title: title,
        message: message,
        type: type,
      })
    },
    getOrderDetail(id) {
      this.$http.get("/v1/service/order/detail?id=" + id).then(
        (response) => {
          if (response.data.code != 200) {
            ElMessage.error(response.data.msg)
            return
          }
          this.order = response.data.data.order
        }
      )
    },
    checkStoreState() {
      let sid = sessionStorage.getItem('storeId')
      this.$http.get("/v1/service/store/state?id=" + sid).then(
        (response) => {
          if (response.data.code != 200) {
            ElMessage.error(response.data.msg)
            return
          }
          if (response.data.data.store.openState == '2') {
            ElMessage.error("门店未营业")
            this.$router.push('/store/setting')
            return
          }
        }
      )
    }
  },
  watch: {
    oid: function (val) {
      if (val != "") {
        this.getOrderDetail(val)
      }
    }
  }
}
</script>