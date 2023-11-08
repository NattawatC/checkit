import axios from 'axios'
import converter from './converter'
import dateTimeServices from './dataTimeServices'
class taskServices {
  priority = ['High', 'Medium', 'Low']
  category = ['Personal', 'Work', 'Health', 'Others']
  date_time_services = new dateTimeServices()
  converter = new converter()
  task_info1 = {
    //mockup data
    id: '1',
    title: 'HereGong',
    note: 'Bull shit guy',
    date_start: '16/10/2023',
    date_end: '17/10/2023',
    time_start: '9:00 AM',
    time_end: '9:00 PM',
    priority: 'High',
    role: ['Personal'],
    category: 'Personal',
  }
  task_info2 = {
    //mockup data
    id: '2',
    title: 'HereGong',
    note: 'Bull shit guy',
    date_start: '16/10/2023',
    date_end: '17/10/2023',
    time_start: '9:00 AM',
    time_end: '9:00 PM',
    priority: 'Medium',
    role: ['Personal'],
    category: 'Work',
  }
  task_info3 = {
    //mockup data
    id: '3',
    title: 'HereGong',
    note: 'Bull shit guy',
    date_start: '16/10/2023',
    date_end: '17/10/2023',
    time_start: '9:00 AM',
    time_end: '9:00 PM',
    priority: 'Low',
    role: ['Personal'],
    category: 'Health',
  }
  task_info4 = {
    //mockup data
    id: '4',
    title: 'HereGong',
    note: 'Bull shit guy',
    date_start: '16/10/2023',
    date_end: '17/10/2023',
    time_start: '9:00 AM',
    time_end: '9:00 PM',
    priority: 'High',
    role: ['Personal'],
    category: 'Others',
  }
  task_info5 = {
    //mockup data
    id: '5',
    title: 'HereGong',
    note: 'Bull shit guy',
    date_start: '16/10/2023',
    date_end: '17/10/2023',
    time_start: '9:00 AM',
    time_end: '9:00 PM',
    priority: 'Medium',
    role: ['Personal'],
    category: 'Personal',
  }

  all_task = [
    this.task_info1,
    this.task_info2,
    this.task_info3,
    this.task_info4,
    this.task_info5,
  ]

  //edit task by id
  async editTask(id: number, task: Task) {
    const info = this.converter.convertTaskToDB(task, id)
    try {
      const respond = await axios.put(
        'http://ict11.ce.kmitl.ac.th:9080/user/task/edit',
        info,
        { params: { task_id: id } }
      )
      if (respond.status === 200) {
        return true
      }
    } catch (error) {
      console.log(error)
      return false
    }
  }

  //get task info by id
  async getTaskInfo(id: string) {
    try {
      const all_task = await this.getAllTask()
      if (Array.isArray(all_task)) {
        const task_info = all_task.find((task: any) => task.task_id === id)
        const task = this.converter.convertTaskFromDB(task_info)
        return task
      }
    } catch (error) {
      console.log(error)
      return false
    }
  }

  //get all task user
  async getAllTask() {
    try {
      const respond = await axios.get(
        'http://ict11.ce.kmitl.ac.th:9080/user/task/getAllTasks'
      )
      if (Array.isArray(respond.data)) {
        return respond.data
      }
    } catch (error) {
      console.log(error)
      return []
    }
  }

  //delete task by id
  async deleteTask(id: string) {
    try {
      const respond = await axios.delete(
        'http://ict11.ce.kmitl.ac.th:9080/user/task/delete',
        { params: { task_id: id } }
      )
      if (respond.status === 202) {
        return true
      }
    } catch (error) {
      console.log(error)
      return false
    }
  }
  //getAllTask of User by priority
  async getAllTaskByPriority(priority: string, task: any) {
    const response = task
    if (Array.isArray(response)) {
      const filteredTasks = response.filter(
        (task) => task.priority === priority
      )
      return filteredTasks
    } else {
      return []
    }
  }
  //filter by priority hight-> medium -> low
  async filterByPriority(task: any) {
    const task_info = task
    const result = []
    if (Array.isArray(task_info)) {
      const filteredTasksHigh = task_info.filter((task) => {
        return task.priority === 'high'
      })
      const filteredTasksMedium = task_info.filter((task) => {
        return task.priority === 'medium'
      })
      const filteredTasksLow = task_info.filter((task) => {
        return task.priority === 'low'
      })
      result.push(
        ...filteredTasksHigh,
        ...filteredTasksMedium,
        ...filteredTasksLow
      )
    }
    return result
  }

  //filter by category
  async filterByCategory(category: string, task: any) {
    const response = task
    if (Array.isArray(response)) {
      const filteredTasks = response.filter(
        (task) => task.category === category
      )
      return filteredTasks
    } else {
      return []
    }
  }

  //searchParam task by title
  async searchTask(searchParam: string, task: any) {
    const task_info = task
    if (Array.isArray(task_info)) {
      const filteredTasks = task_info.filter((task) => {
        const taskTitle = task.title
        return taskTitle.toLowerCase().startsWith(searchParam.toLowerCase())
      })
      return filteredTasks
    } else {
      return []
    }
  }
  //filter by date
  async filterByDate(task: any) {
    const date = this.date_time_services.formatDateForDisplay(new Date())
    const task_info = task
    if (Array.isArray(task_info)) {
      const filteredTasks = task_info.filter((task) => {
        const taskDate = this.date_time_services.formatDateTimeFromDB(
          task.end
        ).date
        //filter from today to future
        return taskDate >= date
      })
      return filteredTasks
    }
  }
}
export default taskServices
