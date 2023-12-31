import axios from 'axios'
import { convertTaskFromDB, convertTaskToDB } from './converter'
import { createUserTeam } from './teamServices'

// let user_email = localStorage.getItem('user_email') || ''
// let user_username = localStorage.getItem('user_username') || ''

// function getUserEmail() {
//   return user_email
// }

// function getUserName() {
//   return user_username
// }

// function setUserEmail(email: string) {
//   user_email = email
//   // Store user_email in localStorage
//   localStorage.setItem('user_email', email)
// }

// function setUserName(name: string) {
//   user_username = name
//   // Store user_username in localStorage
//   localStorage.setItem('user_username', name)
// }

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
    const requestBody = `grant_type=&username=${encodeURIComponent(
      user.email
    )}&password=${encodeURIComponent(
      user.password
    )}&scope=&client_id=&client_secret=`

    try {
      const response = await fetch('http://ict11.ce.kmitl.ac.th:9080/login', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: requestBody,
      })
      if (response.ok) {
        data = await response.json()
        const token = data.access_token
        //set token to global
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        return user.email
      }
    } catch (error) {
      console.log(error)
      return false
    }
  } else {
    //email format is not correct
    console.log('Email format is not correct')
    return false
  }
}

//get user info
async function getUserInfo(user_email: string) {
  try {
    const user_info = await getUserProfile(user_email)
    const current_date = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    })
    const result = {
      username: user_info.name,
      email: user_info.email,
      date: current_date,
      time: 'this.time',
      upcoming_task: await getAllTaskByPriority('High', user_email),
      personal_task: await filterByCategory('Personal', user_email),
      work_task: await filterByCategory('Work', user_email),
      health_task: await filterByCategory('Health', user_email),
      others_task: await filterByCategory('Others', user_email),
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
async function createUserTask(task: Task, user_email: string) {
  task.status = false
  const info = convertTaskToDB(task, 0)
  const json = JSON.stringify(info)
  let task_data
  try {
    const task_info = await fetch(
      `http://ict11.ce.kmitl.ac.th:9080/user/task/create?email=${encodeURIComponent(
        user_email
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
async function getAllTaskOfUser(user_email: string, status: number) {
  try {
    //get user email
    const task_info = await axios.get(
      'http://ict11.ce.kmitl.ac.th:9080/user/task/getAllTasksForUser',
      { params: { email: user_email } }
    )
    for (let i = 0; i < task_info.data.length; i++) {
      task_info.data[i] = convertTaskFromDB(task_info.data[i])
    }
    if (Array.isArray(task_info.data)) {
      const filterTasks = task_info.data.filter((task) => task.status == status)
      return filterTasks
    }
  } catch (error) {
    console.log(error)
    return false
  }
}
//getAllTask of User by priority
async function getAllTaskByPriority(priority: string, user_email: string) {
  let result = []
  const task_info = await getAllTaskOfUser(user_email, 0)
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
async function filterByPriority(user_email: string) {
  const task_info = await getAllTaskOfUser(user_email, 0)
  const result = []
  if (Array.isArray(task_info)) {
    const filteredTasksHigh = task_info.filter((task) => {
      return task.priority === 'High'
    })
    convertTaskFromDB(filteredTasksHigh)
    const filteredTasksMedium = task_info.filter((task) => {
      return task.priority === 'Medium'
    })
    convertTaskFromDB(filteredTasksMedium)
    const filteredTasksLow = task_info.filter((task) => {
      return task.priority === 'Low'
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
async function filterByCategory(category: string, user_email: string) {
  const task_info = await getAllTaskOfUser(user_email, 0)
  if (Array.isArray(task_info)) {
    const filteredTasks = task_info.filter((task) => task.category === category)
    return filteredTasks
  } else {
    return []
  }
}

//searchParam task by title
async function searchTask(searchParam: string, user_email: string) {
  const task_info = await getAllTaskOfUser(user_email, 0)
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
async function filterByDate(user_email: string) {
  const task_info = await getAllTaskOfUser(user_email, 0)
  if (Array.isArray(task_info)) {
    task_info.sort((a, b): any => {
      let compare = Date.parse(a.date_end) - Date.parse(b.date_end)
      return compare
    })
    return task_info
  }
}

async function createTeam(
  team: {
    team_id: number
    name: string
    owner: string
    members: { email: string }[]
  },
  user_email: string
) {
  const user_info = user_email
  const result = await createUserTeam(team, user_info)
  return result
}

async function getUserProfile(user_email: string) {
  try {
    const info = await axios.get(
      'http://ict11.ce.kmitl.ac.th:9080/user/profile',
      {
        params: { email: user_email },
      }
    )
    return info.data
  } catch (error) {
    console.log(error)
    return false
  }
}

async function editUserProfile(name: string, user_email: string) {
  try {
    const info = await getUserProfile(user_email)
    info.name = name
    const json = JSON.stringify(info)
    const user_info = await fetch(
      `http://ict11.ce.kmitl.ac.th:9080/user/editProfile?email=${encodeURIComponent(
        user_email
      )}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: json,
      }
    )
    return true
  } catch (error) {
    console.log(error)
    return false
  }
}

export {
  checkLogin,
  checkRegister,
  createTeam,
  createUserTask,
  editUserProfile,
  filterByCategory,
  filterByDate,
  filterByPriority,
  getAllTaskByPriority,
  getAllTaskOfUser,
  getUserInfo,
  getUserProfile,
  searchTask,
}
