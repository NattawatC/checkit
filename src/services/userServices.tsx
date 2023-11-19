import axios from 'axios'
import { convertTaskFromDB, convertTaskToDB } from './converter'
import { createUserTeam } from './teamServices'

declare global {
  var user_email: string
  var user_username: string
}
global.user_email = 'example@gmail.com'
global.user_username = 'example'

function getUserEmail() {
  return global.user_email
}

function getUserName() {
  return global.user_username
}
function setUserEmail(email: string) {
  return (global.user_email = email)
}
function setUserName(name: string) {
  return (global.user_username = name)
}
//check email format
function checkMailFormat(email: string) {
  //mail format
  var email_format =
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
  //check email format
  if (email_format.test(email)) {
    return true
  } else {
    return false
  }
}

//check user register
async function checkRegister(user: {
  name: string
  email: string
  password: string
}) {
  try {
    //check email format
    if (checkMailFormat(user.email)) {
      console.log('Email format is correct')
      const res = await fetch('http://ict11.ce.kmitl.ac.th:9080/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      })
      setUserEmail(user.email)
      setUserName(user.name)
      return true
    } else {
      //email format is not correct
      console.log('Email format is not correct')
      return false
    }
  } catch (error) {
    console.log(error)
    return false
  }
}

//check user login
async function checkLogin(user: { email: string; password: string }) {
  let data
  //check email format
  if (checkMailFormat(user.email)) {
    console.log('Email format is correct')
    // Prepare the request body
    const requestBody = {
      username: user.email,
      password: user.password,
      grant_type: '',
      scope: '',
      client_id: '',
      client_secret: '',
    }

    const response = await fetch('http://ict11.ce.kmitl.ac.th:9080/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
    if (response.ok) {
      data = await response.json()
      setUserEmail(user.email)
      return true
    }
    // const token = data.access_token
    // //set token to global
    // axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    //email format is not correct
    console.log('Email format is not correct')
    return false
  }
}

//get user info
async function getUserInfo() {
  try {
    const user_info = await getUserProfile()
    setUserName(user_info.name)
    const current_date = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    })
    const result = {
      username: user_info.name,
      email: global.user_email,
      date: current_date,
      time: 'this.time',
      upcoming_task: await getAllTaskByPriority('High'),
      personal_task: await filterByCategory('Personal'),
      work_task: await filterByCategory('Work'),
      health_task: await filterByCategory('Health'),
      others_task: await filterByCategory('Others'),
    }
    return result
  } catch (error) {
    const result = {
      username: 'Error',
      email: '',
      date: 'Error',
      time: '',
      upcoming_task: '',
      personal_task: '',
      work_task: '',
      health_task: '',
      others_task: '',
    }
    console.log(error)
    return result
  }
}
//create task for both personal and team
async function createUserTask(task: Task) {
  task.status = false
  const info = convertTaskToDB(task, 0)
  const json = JSON.stringify(info)
  let task_data
  try {
    const task_info = await fetch(
      `http://ict11.ce.kmitl.ac.th:9080/user/task/create?email=${encodeURIComponent(
        global.user_email
      )}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: json,
      }
    )
    if (task_info.ok) {
      task_data = await task_info.json()
    }
    if (task.role[0] !== 'Personal') {
      // loop task.role array
      for (let i = 0; i < task.role.length; i++) {
        const team_task_info = await fetch(
          `http://ict11.ce.kmitl.ac.th:9080/user/team/addTask?team_id=${encodeURIComponent(
            task.role[i]
          )}&task_id=${encodeURIComponent(task_data.task_id)}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
      }
    }
    return true
  } catch (error: any) {
    console.log(error.response.data)
    return false
  }
}
//get all task of user
async function getAllTaskOfUser() {
  try {
    //get user email
    const task_info = await axios.get(
      'http://ict11.ce.kmitl.ac.th:9080/user/task/getAllTasksForUser',
      { params: { email: global.user_email } }
    )
    for (let i = 0; i < task_info.data.length; i++) {
      task_info.data[i] = convertTaskFromDB(task_info.data[i])
    }
    return task_info.data
  } catch (error) {
    console.log(error)
    return false
  }
}
//getAllTask of User by priority
async function getAllTaskByPriority(priority: string) {
  let result = []
  const task_info = await getAllTaskOfUser()
  if (Array.isArray(task_info)) {
    const filteredTasks = task_info.filter((task) => task.priority === priority)
    for (let i = 0; i < filteredTasks.length; i++) {
      result[i] = convertTaskFromDB(filteredTasks[i])
    }
    return filteredTasks
  } else {
    return []
  }
}
//filter by priority hight-> medium -> low
async function filterByPriority() {
  const task_info = await getAllTaskOfUser()
  const result = []
  if (Array.isArray(task_info)) {
    const filteredTasksHigh = task_info.filter((task) => {
      return task.priority === 'high'
    })
    convertTaskFromDB(filteredTasksHigh)
    const filteredTasksMedium = task_info.filter((task) => {
      return task.priority === 'medium'
    })
    convertTaskFromDB(filteredTasksMedium)
    const filteredTasksLow = task_info.filter((task) => {
      return task.priority === 'low'
    })
    convertTaskFromDB(filteredTasksLow)
    result.push(
      ...filteredTasksHigh,
      ...filteredTasksMedium,
      ...filteredTasksLow
    )
  }
  return result
}

//filter by category
async function filterByCategory(category: string) {
  const task_info = await getAllTaskOfUser()
  if (Array.isArray(task_info)) {
    const filteredTasks = task_info.filter((task) => task.category === category)
    return filteredTasks
  } else {
    return []
  }
}

//searchParam task by title
async function searchTask(searchParam: string) {
  const task_info = await getAllTaskOfUser()
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
async function filterByDate() {
  const task_info = await getAllTaskOfUser()
  if (Array.isArray(task_info)) {
    task_info.sort((a, b): any => {
      let compare = Date.parse(a.date_end) - Date.parse(b.date_end)
      return compare
    })
    return task_info
  }
}

async function createTeam(team: Team) {
  const user_info = global.user_email
  const result = await createUserTeam(team, user_info)
  return result
}

async function getUserProfile() {
  try {
    const info = await axios.get(
      'http://ict11.ce.kmitl.ac.th:9080/user/profile',
      {
        params: { email: global.user_email },
      }
    )
    return info.data
  } catch (error) {
    console.log(error)
    return false
  }
}

async function editUserProfile(name: string) {
  try {
    const info = await getUserProfile()
    info.data.name = name
    const json = JSON.stringify(info.data)
    const user_info = await fetch(
      `http://ict11.ce.kmitl.ac.th:9080/user/editProfile?email=${encodeURIComponent(
        global.user_email
      )}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: json,
      }
    )
    setUserName(name)
    return true
  } catch (error) {
    console.log(error)
    return false
  }
}
export {
  checkRegister,
  checkLogin,
  getUserInfo,
  createUserTask,
  getAllTaskOfUser,
  getAllTaskByPriority,
  filterByPriority,
  filterByCategory,
  searchTask,
  filterByDate,
  createTeam,
  getUserEmail,
  setUserEmail,
  getUserName,
  setUserName,
  editUserProfile,
  getUserProfile,
}
