/**
 * @Description:
 * @author wxj
 * @date 2020-10-12-13:38
 */
import axios from './http'
// import axios from 'axios'
const serve = {
  processesShow () {
    return axios('/processes/showProcesses', {
      method: 'get'
    })
  },
  processesExampleShow () {
    return axios('/processInstances/showProcesses', {
      method: 'get'
    })
  },
  businessTemplateShow () {
    return axios('/businessLists/showBusinessLists', {
      method: 'get'
    })
  },
  businessListsShow () {
    return axios('/businessTemplates/showBusinessTemplates', {
      method: 'get'
    })
  },
  processDataEcho (data) {
    return axios('/processes/processesDataEcho', {
      method: 'post',
      data
    })
  },
  processDataSave (data) {
    return axios('/processes/processesDataSave', {
      method: 'post',
      data
    })
  },
  processDataRemove (data) {
    return axios('/processes/removeProcesses', {
      method: 'delete',
      data
    })
  },
  processTaskRead (data) {
    return axios('/processInstances/showProcesses', {
      method: 'get',
      data
    })
  },
  businessListsDataEcho (data) {
    return axios('/businessLists/businessListDataEcho', {
      method: 'post',
      data
    })
  },
  businessListsDataSave (data) {
    return axios('/businessLists/businessListDataSave', {
      method: 'post',
      data
    })
  },
  businessListRemove (data) {
    return axios('/businessLists/removeBusinessList', {
      method: 'delete',
      data
    })
  },
  businessTemplateDataEcho (data) {
    return axios('/businessTemplates/businessTemplateDataEcho', {
      method: 'post',
      data
    })
  },
  businessTemplateDataSave (data) {
    return axios('/businessTemplates/businessTemplateDataSave', {
      method: 'post',
      data
    })
  },
  businessTemplateRemove (data) {
    return axios('/businessTemplates/removeBusinessTemplate', {
      method: 'delete',
      data
    })
  }
}

export default serve
