<style scoped>
.header {
    margin: 0;
    padding: 0;
    margin-bottom: 25px;
    padding-bottom: 8px;
    border-bottom: 1px #e0e0e0 solid;
}

.title {
    margin: 0;
    padding: 0;
    font-size: 22px;
    color: #409EFF;
    font-weight: bold;
}
</style>
<template>
    <div style="background: #ffffff;border-radius: 8px; padding: 20px;">
        <div class="header" v-if="flag">
            <el-row>
                <el-col :span="12">
                    <p class="title">销售商品</p>
                </el-col>
                <el-col :span="12" style="text-align: right;">
                </el-col>
            </el-row>
        </div>
        <!-- 搜索栏 -->
        <div>
            <el-form :inline="true" :model="search.data" :rules="search.rules">
                <el-form-item label="商品ID" prop="id">
                    <el-input v-model="search.data.id" clearable style="width: 150px;" />
                </el-form-item>
                <el-form-item label="商品名称">
                    <el-input v-model="search.data.name" clearable style="width: 150px;" />
                </el-form-item>
                <el-form-item label="商品类别">
                    <el-select v-model="search.data.class" placeholder="请选择" clearable style="width: 150px;">
                        <el-option v-for="(item, index) in commClassOptions" :key="index" :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="销售状态">
                    <el-select v-model="search.data.sellState" placeholder="请选择" clearable style="width: 150px;">
                        <el-option v-for="(item, index) in sellStateOptions" :key="index" :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchSubmit">查询</el-button>
                    <el-button type="default" @click="searchReset">重置</el-button>
                </el-form-item>
            </el-form>
        </div>

        <!-- 操作栏 -->
        <div class="btn-container" style="margin-bottom: 15px;">
            <el-button type="success">在售</el-button>
            <el-button type="danger">售罄</el-button>
            <el-button type="default" :icon="Refresh" round @click="refresh">刷新</el-button>
        </div>

        <!-- 表格主体 -->
        <el-table :data="tabledata" style="width: 100%" border height="550px" table-layout="auto"
            @selection-change="handleSelectionChange">
            <template #empty>无数据</template>
            <!-- 数据部分 -->
            <el-table-column type="selection" width="50" fixed="left" />
            <el-table-column prop="id" label="商品ID" min-width="80" fixed="left" sortable />
            <el-table-column prop="name" label="商品名称" min-width="200" :show-overflow-tooltip="true" />
            <el-table-column label="状态" width="80" align="center">
                <template #default="scope">
                    <el-tag type="success" effect="plain" round v-if="scope.row.sellState === '1'">
                        在售
                    </el-tag>
                    <el-tag type="danger" effect="plain" round v-else-if="scope.row.sellState === '2'">
                        售罄
                    </el-tag>
                    <el-tag type="info" effect="plain" round v-else>
                        下架
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="class" label="分类" min-width="200" :show-overflow-tooltip="true" />
            <el-table-column prop="daySell" label="日销量" min-width="80" :show-overflow-tooltip="true" />
            <!-- 行内操作栏 -->
            <el-table-column fixed="right" label="操作" min-width="200" align="center">
                <template #default="scope">
                    <el-button type="success" size="small">在售</el-button>
                    <el-button type="danger" size="small">售罄</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 对话框 -->
    </div>
</template>

<script>
import { ElMessage } from 'element-plus'
import { Refresh } from '@element-plus/icons-vue'
export default {
    components: {
    },
    props: {
        flag: {
            //是否展示标题
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            Refresh,
            //表格数据
            tabledata: [
                {
                    "id": 1,
                    "name": "喜柿多多",
                    "sellState": "1",
                    "daySell": "20",
                    "class": ['果茶', '新品']
                },
                {
                    "id": 2,
                    "name": "多肉桃李",
                    "sellState": "2",
                    "daySell": "20",
                    "class": ['果茶']
                },
                {
                    "id": 3,
                    "name": "牛油果酸酪",
                    "sellState": "2",
                    "daySell": "20",
                    "class": ['果茶']
                }
            ],
            //被选中的门店
            multipleSelection: [
            ],
            //搜索栏
            search: {
                data: {
                    "id": "",
                    "name": "",
                    "sellState": "",
                    "class": ""
                },
                rules: {
                    id: [{
                        pattern: /^[-]?\d+(\.\d+)?$/,
                        trigger: ['blur', 'change'],
                        message: '请输入数字'
                    }],
                },
            },
            //选项ß
            //销售状态
            sellStateOptions: [
                {
                    "value": "1",
                    "label": "在售"
                },
                {
                    "value": "2",
                    "label": "售罄"
                }],
            //商品分类
            commClassOptions: [{
                "value": "果茶",
                "label": "果茶"
            },
            {
                "value": "奶茶",
                "label": "奶茶"
            },
            {
                "value": "纯茶",
                "label": "纯茶"
            },
            {
                "value": "新品",
                "label": "新品"
            }],
        }
    },
    methods: {
        //搜索相关
        // 重置搜索数据
        searchReset() {
            this.search.data = {
                "id": "",
                "name": "",
                "province": "",
                "city": "",
                "phone": "",
                "openState": "",
                "openArea": [],
                "phone": ""
            }
        },
        //搜索
        searchSubmit() {
            ElMessage("搜索")
        },
        //多选
        handleSelectionChange(val) {
            this.multipleSelection = val;
            // console.log(this.multipleSelection)
        },
        //刷新表格数据
        refresh() {
            ElMessage("刷新")
        }
    },
    watch: {
    }
}
</script>