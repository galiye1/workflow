<!--业务模板页面-->
<template>
  <a-layout id="components-layout-demo-custom-trigger">
    <a-layout-sider :trigger="null" collapsible>
      <div class="logo" />
      <a-menu theme="dark" mode="inline" v-model="current">
        <a-menu-item key="1">
          <router-link to="/">
            <span>流程展示</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="2">
          <router-link to="/processesExample">
            <span>流程实例</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="3">
          <router-link to="/businessTemplate">
            <span>业务模板</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="4">
          <router-link to="/businessLists">
            <span>业务列表</span>
          </router-link>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0">
      </a-layout-header>
      <a-layout-content :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '280px' }">
        <a-button class="addBtn"><router-link to="/businessTemplateEdit">新增</router-link></a-button>
        <a-table :data-source="businessTemplate" :columns="columns" :scroll="{ y: 1002 | true }">
          <template slot="operation" slot-scope="text, record">
            <a-button class="editBtn" @click="pushBusinessTemplateId(record.businessTemplateId - 1)"><router-link to="/businessTemplateEdit">编辑</router-link></a-button>
            <a-button class="removeBtn">删除</a-button>
          </template>
        </a-table>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
export default {
  name: 'BusinessTemplate',
  data () {
    return {
      columns: [
        {
          title: '表id',
          dataIndex: 'tableId'
        },
        {
          title: '表名',
          dataIndex: 'tableName'
        },
        {
          title: '描述',
          dataIndex: 'description'
        },
        {
          title: '操作',
          dataIndex: 'operation',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      current: ['3'], // 当前侧边栏选择项
      businessTemplate: [] // 业务模板数据
    }
  },
  mounted () { // 向后端请求业务模板数据
    this.$axios.businessTemplateShow().then((res) => {
      if (typeof (res.data) != 'undefined') {
        this.businessTemplate = res.data
        this.$store.state.businessTemplate = JSON.parse(JSON.stringify(this.businessTemplate))
      }
    })
  },
  methods: {
    pushBusinessTemplateId (key) { // 保存当前业务模板id
      this.$store.state.businessTemplateId = key
    }
  }
}
</script>

<style lang="less" scoped>
  @import "../assets/css/processesShow";
</style>
