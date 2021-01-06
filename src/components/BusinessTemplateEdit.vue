<template>
  <div id="businessTemplateEdit">
    <div class="operate">
      <a-button class="saveBtn">保存</a-button><a-button class="cancelBtn">取消</a-button>
    </div>
    <div class="headerDiv">
      <a-input addon-before="名称" placeholder="请输入名称"/>
      <a-input addon-before="描述" placeholder="请输入描述"/>
      <a-input-group>
        <a-input default-value="主业务表" disabled="true"/>
        <a-select :options="mainTableOptions"></a-select>
      </a-input-group>
    </div>
    <a-button class="addChildTableBtn" @click="addChildTableBtn">添加子表</a-button>
    <a-modal v-model="childTableShow"  cancelText="取消" okText="确定">
      <a-table :row-selection="rowSelection" :data-source="childTableData" :columns="childTableColumns" :scroll="{ y:520 | true }">
      </a-table>
    </a-modal>
    <a-table :data-source="businessTemplateChildTable" :columns="columns" :scroll="{ y: 1002 | true }">
      <template slot="relationship" slot-scope="">
        <a-select :options="relationshipOptions"></a-select>
      </template>
      <template slot="operation" slot-scope="">
        <a-button class="removeBtn">删除</a-button>
      </template>
    </a-table>
  </div>
</template>

<script>
export default {
  name: 'BusinessTemplateEdit',
  data () {
    return {
      columns: [
        {
          title: '关系',
          dataIndex: 'relationship',
          scopedSlots: { customRender: 'relationship' }
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
          title: '外键',
          dataIndex: 'foreignKey'
        },
        {
          title: '操作',
          dataIndex: 'operation',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      childTableColumns: [
        {
          title: '描述',
          dataIndex: 'businessListDescription'
        },
        {
          title: '表名',
          dataIndex: 'businessListName'
        }
      ],
      mainTableOptions: [
        {
          value: '1',
          label: '业务表1'
        },
        {
          value: '2',
          label: '业务表2'
        }
      ],
      relationshipOptions: [
        {
          value: 'one',
          label: '一对一'
        },
        {
          value: 'more',
          label: '一对多'
        }
      ],
      childTableData: [], // 可添加子表数据
      childTableShow: false, // 是否展示可选择子表弹框
      businessTemplateId: this.$store.state.businessTemplateId, // 当前业务模板id
      businessTemplateName: '', // 当前业务模板名称
      businessTemplateDescription: '', // 当前业务模板描述
      businessTemplateChildTable: [] // 业务模板已添加子表数据
    }
  },
  mounted () { // 数据回显
    this.$axios.businessTemplateDataEcho(this.businessTemplateId).then((res) => {
      if (typeof (res.data) != 'undefined') {
        this.businessTemplateName = res.data.businessTemplateName
        this.businessTemplateDescription = res.data.businessTemplateDescription
        this.businessTemplateChildTable = res.data.childrenTable
      }
    })
  },
  computed: {
    rowSelection () {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
        },
        getCheckboxProps: record => ({
          props: {}
        })
      }
    }
  },
  methods: {
    addChildTableBtn () { // 添加子表
      this.childTableData = this.$store.state.businessLists
      this.childTableShow = true
    }
  }
}
</script>

<style lang="less" scoped>
@import "../assets/css/businessTemplateEdit";
</style>
