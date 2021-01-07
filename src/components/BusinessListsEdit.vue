<!--业务列表编辑页面-->
<template>
  <div id="businessListsEdit">
    <div class="operate">
      <a-button class="saveBtn" @click="save">保存</a-button><a-button class="cancelBtn" @click="cancel">取消</a-button>
    </div>
    <div class="headerDiv">
      <a-input v-model="businessListName" addon-before="名称" placeholder="请输入名称"/>
      <a-input v-model="businessListDescription" addon-before="描述" placeholder="请输入描述"/>
      <a-input v-model="businessListDatabaseName" addon-before="数据库表名" placeholder="请输入数据库表名"/>
      <span class="rule">*数据库表名不能为数字和汉字</span>
    </div>
    <a-button class="addField" @click="addField">添加字段</a-button>
    <a-table :data-source="fieldTable" :columns="columns" :scroll="{ y: 1002 | true }" :pagination="false">
      <template slot="fieldDescription" slot-scope="text, record">
        <a-input
          v-if="record.editable"
          style="margin: -5px 0"
          :value="text"
          @change="e => handleDescriptionChange(e.target.value, record.key)"
        />
        <template v-else>
          {{ text }}
        </template>
      </template>
      <template slot="fieldName" slot-scope="text, record">
        <a-input
          v-if="record.editable"
          style="margin: -5px 0"
          :value="text"
          @change="e => handleNameChange(e.target.value, record.key)"
        />
        <template v-else>
          {{ text }}
        </template>
      </template>
      <template slot="isFill" slot-scope="text, record">
        <a-select class="isFillSelect" v-if="record.editable" :options="isFillOptions" @change="isFillValueChange"></a-select>
        <template v-else>
          {{ text }}
        </template>
      </template>
      <template slot="isPrimaryKey" slot-scope="text, record">
        <a-select class="isPrimarySelect" v-if="record.editable" :options="isPrimaryOptions" @change="isPrimaryKeyValueChange"></a-select>
        <template v-else>
          {{ text }}
        </template>
      </template>
      <template slot="fieldType" slot-scope="text, record">
        <a-select class="fieldTypeSelect" v-if="record.editable" :options="fieldTypeOptions" @change="fieldTypeValueChange"></a-select>
        <template v-else>
          {{ text }}
        </template>
      </template>
      <template slot="fieldLength" slot-scope="text, record">
        <a-input
          v-if="record.editable"
          style="margin: -5px 0"
          :value="text"
          @change="e => handleLengthChange(e.target.value, record.key)"
        />
        <template v-else>
          {{ text }}
        </template>
      </template>
      <template slot="operation" slot-scope="text, record">
        <a-button class="addBtn" v-if="record.editable" @click="addBtnClick(record.key)">确定</a-button>
        <a-button class="removeBtn" v-if="!record.editable">删除</a-button>
      </template>
    </a-table>
  </div>
</template>

<script>
export default {
  name: 'BusinessListsEdit',
  data () {
    return {
      columns: [
        {
          title: '描述',
          dataIndex: 'fieldDescription',
          scopedSlots: { customRender: 'fieldDescription' }
        },
        {
          title: '字段名',
          dataIndex: 'fieldName',
          scopedSlots: { customRender: 'fieldName' }
        },
        {
          title: '必填',
          dataIndex: 'isFill',
          scopedSlots: { customRender: 'isFill' }
        },
        {
          title: '是否主键',
          dataIndex: 'isPrimaryKey',
          scopedSlots: { customRender: 'isPrimaryKey' }
        },
        {
          title: '数据类型',
          dataIndex: 'fieldType',
          scopedSlots: { customRender: 'fieldType' }
        },
        {
          title: '长度',
          dataIndex: 'fieldLength',
          scopedSlots: { customRender: 'fieldLength' }
        },
        {
          title: '操作',
          dataIndex: 'operation',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      isFillOptions: [ // 是否必填select选项
        {
          value: '是',
          label: '是'
        },
        {
          value: '否',
          label: '否'
        }
      ],
      isPrimaryOptions: [ // 是否主键select选项
        {
          value: '是',
          label: '是'
        },
        {
          value: '否',
          label: '否'
        }
      ],
      fieldTypeOptions: [ // 数据类型select选项
        {
          value: 'java.lang.Integer',
          label: 'Number'
        },
        {
          value: 'java.lang.String',
          label: 'String'
        },
        {
          value: 'bool',
          label: 'Bool'
        }
      ],
      fieldTable: [], // 字段表
      isFillValue: '', // 是否必填字段值
      isPrimaryKeyValue: '', // 是否主键字段值
      fieldTypeValue: '', // 数据类型字段值
      lengthValue: 0, // 数据长度字段值
      businessListId: this.$store.state.businessListId, // 当前业务id
      businessListName: '', // 当前业务名称
      businessListDescription: '', // 当前业务描述
      businessListDatabaseName: '' // 当前业务数据库表名
    }
  },
  mounted () { // 数据回显
    this.$axios.businessListsDataEcho(this.businessListId).then((res) => {
      if (typeof (res.data) !== 'undefined') {
        this.fieldTable = res.data.fieldEntityVos
        this.businessListName = res.data.businessListName
        this.businessListDescription = res.data.businessListDescription
        this.businessListDatabaseName = res.data.businessListTable
      }
    })
  },
  methods: {
    addField () { // 添加字段
      const obj = {
        key: this.fieldTable.length,
        fieldDescription: '',
        fieldName: '',
        isFill: '',
        isPrimaryKey: '',
        fieldType: '',
        fieldLength: '',
        editable: true
      }
      this.fieldTable.push(obj)
    },
    addBtnClick (key) { // 添加好字段后保存
      for (let i = 0; i < this.fieldTable.length; i++) {
        if (i == key) {
          this.fieldTable[i].editable = false
          this.fieldTable[i].isFill = this.isFillValue
          this.fieldTable[i].isPrimaryKey = this.isPrimaryKeyValue
          this.fieldTable[i].fieldType = this.fieldTypeValue
          this.fieldTable[i].fieldLength = this.lengthValue
        }
      }
    },
    handleDescriptionChange (value, key) { // 业务描述input值处理
      for (let i = 0; i < this.fieldTable.length; i++) {
        if (i == key) {
          this.fieldTable[i].fieldDescription = value
        }
      }
    },
    handleNameChange (value, key) { // 业务名称input值处理
      for (let i = 0; i < this.fieldTable.length; i++) {
        if (i == key) {
          this.fieldTable[i].fieldName = value
        }
      }
    },
    isFillValueChange (value) { // 是否必填select值处理
      this.isFillValue = value
    },
    isPrimaryKeyValueChange (value) { // 主键select值处理
      if (value == '是') {
        this.isPrimaryKeyValue = 1
      } else {
        this.isPrimaryKeyValue = 0
      }
    },
    fieldTypeValueChange (value) { // 数据类型select值处理
      this.fieldTypeValue = value
    },
    handleLengthChange (value) { // 数据长度input值处理
      this.lengthValue = value
    },
    save () { // 保存编辑页面数据发送给后台
      this.$axios.businessListsDataSave({
        businessListId: this.businessListId,
        businessListName: this.businessListName,
        businessListDescription: this.businessListDescription,
        businessListTable: this.businessListDatabaseName,
        fieldEntityVos: this.fieldTable
      }).then(res => {
        this.$router.push({ path: '/businessLists' })
      })
    },
    cancel () { // 取消当前数据编辑
      this.$router.push({ path: '/businessLists' })
    }
  }
}
</script>

<style lang="less" scoped>
  @import "../assets/css/businessListsEdit";
</style>
