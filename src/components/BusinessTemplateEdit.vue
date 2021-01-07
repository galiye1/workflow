<template>
  <div id="businessTemplateEdit">
    <div class="operate">
      <a-button class="saveBtn">保存</a-button><a-button class="cancelBtn">取消</a-button>
    </div>
    <div class="headerDiv">
      <a-input v-model="businessTemplateName" addon-before="名称" placeholder="请输入名称" @change="nameInputChange"/>
      <a-input v-model="businessTemplateDescription" addon-before="描述" placeholder="请输入描述" @change="descriptionInputChange"/>
      <a-input-group>
        <a-input default-value="主业务表" disabled="true"/>
        <a-select :options="mainTableOptions" :placeholder="businessTemplateMainTable" @change="mainTableSelectChange"></a-select>
      </a-input-group>
    </div>
    <a-button class="addChildTableBtn" @click="addChildTableBtn">添加子表</a-button>
    <a-modal v-model="childTableShow"  cancelText="取消" okText="确定" @ok="selectedChildTableSave">
      <a-table class="childTableModal" :row-selection="rowSelection" :data-source="childTableData" :columns="childTableColumns" :scroll="{ y:320 | true }" :pagination="false">
      </a-table>
    </a-modal>
    <a-table :data-source="businessTemplateChildTable" :columns="columns" :scroll="{ y: 1002 | true }" :pagination="false">
      <template slot="relationship" slot-scope="text, record">
        <a-select class="relationshipSelect" v-if="record.editable" :options="relationshipOptions" @change="relationshipValueChange">
        </a-select>
        <template v-else>
          {{text}}
        </template>
      </template>
      <template slot="foreignKey" slot-scope="text, record">
        子表字段<a-select :title="childForeignKeyValue" v-if="record.editable" class="foreignKeySelect" :options="childFieldOptions" @change="(value) => { childForeignKeyChange(value, record.businessListId - 1) }">
        </a-select>
        <template v-else>
          {{text.childForeignKeyValue[record.businessListId - 1]}}
        </template>
        <br/>对应
        <a-select :title="mainForeignKeyValue" v-if="record.editable" class="foreignKeySelect" :options="mainFieldOptions" @change="(value) => { mainForeignKeyChange(value, record.businessListId - 1) }">
        </a-select>
        <template v-else>
          {{text.mainForeignKeyValue[record.businessListId - 1]}}
        </template>
      </template>
      <template slot="operation" slot-scope="text, record">
        <a-button class="addBtn" v-if="record.editable" @click="addBtnClick(record.businessListId - 1)">确定</a-button>
        <a-button class="removeBtn" v-if="!record.editable" @click="removeBtnClick(record.businessListId - 1)">删除</a-button>
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
          dataIndex: 'businessListName'
        },
        {
          title: '描述',
          dataIndex: 'businessListDescription'
        },
        {
          title: '外键',
          dataIndex: 'foreignKey',
          scopedSlots: { customRender: 'foreignKey' }
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
      mainTableOptions: [],
      relationshipOptions: [
        {
          value: '一对一',
          label: '一对一'
        },
        {
          value: '一对多',
          label: '一对多'
        }
      ],
      childFieldOptions: [
        {
          value: 'businessListId',
          label: 'businessListId'
        },
        {
          value: 'businessListName',
          label: 'businessListName'
        },
        {
          value: 'businessListDescription',
          label: 'businessListDescription'
        }
      ], // 子表字段选择
      mainFieldOptions: [
        {
          value: 'businessListId',
          label: 'businessListId'
        },
        {
          value: 'businessListName',
          label: 'businessListName'
        },
        {
          value: 'businessListDescription',
          label: 'businessListDescription'
        }
      ], // 主表字段选择
      // childTableData: [], // 可添加子表数据
      childTableData: [
        {
          businessListId: 1,
          businessListName: 'a',
          businessListDescription: 'b',
          editable: true
        },
        {
          businessListId: 2,
          businessListName: 'cc',
          businessListDescription: 'd',
          editable: true
        }
      ],
      childTableShow: false, // 是否展示可选择子表弹框
      businessTemplateId: this.$store.state.businessTemplateId, // 当前业务模板id
      businessTemplateName: '', // 当前业务模板名称
      businessTemplateDescription: '', // 当前业务模板描述
      businessTemplateChildTable: [], // 业务模板已添加子表数据
      businessTemplateMainTable: '', // 当前选择的主业务表
      selectedChildTableList: [], // 已选择子表列表
      childForeignKeyValue: [], // 子表外键值
      mainForeignKeyValue: [], // 主表外键值
      relationship: '' // 对应关系
    }
  },
  mounted () { // 数据回显
    this.$axios.businessTemplateDataEcho(this.businessTemplateId).then((res) => {
      if (typeof (res.data) != 'undefined') {
        this.businessTemplateName = res.data.businessTemplateName
        this.businessTemplateDescription = res.data.businessTemplateDescription
        this.businessTemplateMainTable = res.data.businessTemplateMainTable
        this.businessTemplateChildTable = res.data.childrenTable
        for (let i = 0; i < this.businessTemplateChildTable.length; i++) {
          const obj = {
            value: this.businessTemplateChildTable[i].childrenTableName,
            label: this.businessTemplateChildTable[i].childrenTableDescription
          }
          this.mainTableOptions.push(obj)
        }
      }
    })
  },
  computed: {
    rowSelection () {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectedChildTableList = selectedRows
          console.log(selectedRows)
        },
        getCheckboxProps: record => ({
          props: {}
        })
      }
    }
  },
  methods: {
    addChildTableBtn () { // 添加子表按钮
      // this.childTableData = this.$store.state.businessLists
      this.childTableShow = true
    },
    mainTableSelectChange (value) { // 主表值改变
      this.businessTemplateMainTable = value
    },
    nameInputChange (value) { // 名称值改变
      this.businessTemplateName = value
    },
    descriptionInputChange (value) { // 描述值改变
      this.businessTemplateDescription = value
    },
    childForeignKeyChange (value, key) { // 子表外键select值改变
      this.childForeignKeyValue[key] = value
    },
    mainForeignKeyChange (value, key) { // 主表外键select值改变
      this.mainForeignKeyValue[key] = value
    },
    relationshipValueChange (value) { // 关系值改变
      this.relationship = value
    },
    selectedChildTableSave () { // 保存并展示已选择的子表
      this.childTableShow = false
      for (let i = 0; i < this.selectedChildTableList.length; i++) {
        console.log(this.selectedChildTableList[i])
        this.businessTemplateChildTable.push(this.selectedChildTableList[i])
      }
      this.selectedChildTableList.splice(0, this.selectedChildTableList.length)
      console.log(this.businessTemplateChildTable)
    },
    addBtnClick (key) { // 添加好子表后保存
      for (let i = 0; i < this.businessTemplateChildTable.length; i++) {
        if (i == key) {
          this.businessTemplateChildTable[i].editable = false
          this.businessTemplateChildTable[i].relationship = this.relationship
          this.businessTemplateChildTable[i].childrenTableName = this.businessTemplateName
          this.businessTemplateChildTable[i].childrenTableDescription = this.businessTemplateDescription
          this.businessTemplateChildTable[i].foreignKey = {
            childForeignKeyValue: this.childForeignKeyValue,
            mainForeignKeyValue: this.mainForeignKeyValue
          }
        }
      }
    },
    removeBtnClick (key) { // 删除子表
      for (let i = 0; i < this.businessTemplateChildTable.length; i++) {
        if (i == key) {
          this.businessTemplateChildTable.splice(i, 1)
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "../assets/css/businessTemplateEdit";
</style>
