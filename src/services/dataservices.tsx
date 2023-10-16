import { object } from 'zod'

class dataservices {
  user = { email: '', password: '' }
  task_info1 = {
    //mockup data
    id: '1',
    title: 'HereGong',
    note: 'Bull shit guy',
    date_start: '16/10/2023',
    date_end: '17/10/2023',
    time_start: '9:00 AM',
    time_end: '9:00 PM',
    priority: 'high',
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
    priority: 'high',
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
    priority: 'high',
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
    priority: 'high',
    role: ['Personal'],
    category: 'Others',
  }
  all_task = [
    this.task_info1,
    this.task_info2,
    this.task_info3,
    this.task_info4,
  ]
  //check email format
  checkMailFormat(email: string) {
    //mail format
    var email_format =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    //mail pattern
    const mail_pattern =
      /@(gmail\.com|hotmail\.com|yahoo\.com|kmitl.ac\.th|outlook\.com|icloud.\com)$/i
    //check email format
    if (email_format.test(email) && mail_pattern.test(email)) {
      return true
    } else {
      return false
    }
  }

  //pading number
  padTo2Digits(number: number) {
    return number.toString().padStart(2, '0')
  }
  //date format
  formatDate(date: Date) {
    return [
      this.padTo2Digits(date.getDate()),
      this.padTo2Digits(date.getMonth() + 1),
      date.getFullYear(),
    ].join('/')
  }

  //check user register
  //TODO: connect with database
  checkRegister(user: { username: string; email: string; password: string }) {
    //check email format
    if (this.checkMailFormat(user.email)) {
      console.log('Email format is correct')
      return true
    } else {
      //email format is not correct
      console.log('Email format is not correct')
      return false
    }
  }

  //check user login
  //TODO: connect with database
  checkLogin(user: { email: string; password: string }) {
    //check email format
    if (this.checkMailFormat(user.email)) {
      console.log('Email format is correct')
      this.user = user
      return true
    } else {
      //email format is not correct
      console.log('Email format is not correct')
      return false
    }
  }

  //get user info
  getUserInfo() {
    //get current date & time
    let date = this.formatDate(new Date())
    let time = new Date().toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    })
    //get user info from database
    let info = this.user
    //TODO: fetch data from database
    //query user info
    const user_info = {
      //mockup data
      username: 'Test',
      date: date,
      time: time,
      upcoming_task: [{ task: object }],
      personal_task: [{ task: object }],
      worker_task: [{ task: object }],
      health_task: [{ task: object }],
      others_task: [{ task: object }],
    }
    return user_info
  }

  //create task
  //TODO: post data to database
  createUserTask(task: {
    title: string
    note: string
    date_start: Date
    date_end: Date
    time_start: string
    time_end: string
    priority: string
    role: [string]
    category: string
  }) {
    return true
  }

  //edit task by id
  //TODO: post data to database
  editTask(task: {
    id: string
    title: string
    note: string
    date_start: Date
    date_end: Date
    time_start: string
    time_end: string
    priority: string
    role: [string]
    category: string
  }) {
    return true
  }

  //get task info by id
  //TODO: get data from database
  getTaskInfo(id: string) {
    const result = this.all_task.find((task_data) => task_data.id === id)
    console.log(result)
    return result
  }

  //get all task by category
  //TODO: get all task data from database
  getAllTask(category: string) {
    //find category in all task
    const task = this.all_task.find((task) => task.category === category)
    console.log(task)
    return task
  }

  //delete task by id
  //TODO: delete task request to database
  deleteTask(id: string) {
    const result = this.all_task.find((task_data) => task_data.id === id)
    return true
  }
}
export default dataservices
