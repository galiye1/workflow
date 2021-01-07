<template>
  <div>
    <bpmn-modeler
      ref="refNode"
      :xml="xml"
      :users="users"
      :groups="groups"
      :categorys="categorys"
      :is-view="false"
      @save="save"
    />
  </div>
</template>

<script>
import bpmnModeler from 'workflow-bpmn-modeler'

export default {
  components: {
    bpmnModeler
  },
  data () {
    return {
      xml: '', // 后端查询到的xml
      users: [
        { name: '张三', id: 'zhangsan' },
        { name: '李四', id: 'lisi' },
        { name: '王五', id: 'wangwu' }
      ],
      groups: [
        { name: 'web组', id: 'web' },
        { name: 'java组', id: 'java' },
        { name: 'python组', id: 'python' }
      ],
      categorys: [
        { name: 'OA', id: 'oa' },
        { name: '财务', id: 'finance' }
      ],
      processNameInputValue: '',
      processId: this.$store.state.processId
    }
  },
  mounted () {
    // window.addEventListener('beforeunload', () => {
    //   sessionStorage.setItem('xml', JSON.stringify(this.xml))
    // })
    // if (sessionStorage.getItem('xml')) {
    //   this.xml = sessionStorage.getItem('xml')
    //   console.log(this.xml)
    // }
    this.$axios.processDataEcho(this.processId).then(res => {
      if (typeof (res.data) != 'undefined') {
        this.processNameInputValue = res.data.processName
        this.xml = res.data.processXML
      }
      setTimeout(() => {
        const formChildNodes = document.getElementsByTagName('form')[0].childNodes
        const processInputNode = (((formChildNodes[2].childNodes)[1].childNodes)[0].childNodes)[1]
        processInputNode.value = this.processNameInputValue
        processInputNode.oninput = function (e) {
          this.processNameInputValue = processInputNode.value
        }
      }, 100)
    })
  },
  methods: {
    getModelDetail () {
      // 发送请求，获取xml
      // this.xml = response.xml
    },
    save (data) {
      // console.log(data) // { process: {...}, xml: '...', svg: '...' }
      this.xml = data.xml
      this.$axios.processDataSave({
        processName: this.processNameInputValue,
        processXML: this.xml
      }).then(res => {
        this.$router.push({
          path: '/'
        })
      })
    }
  }
}
</script>
