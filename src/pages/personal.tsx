'use client'
import { Footer, NavBar, SearchBar } from '@/components/common'
import { MainLayout } from '@/components/layouts'
import TaskItem from '@/components/taskPage/TaskItem'
import { filterByCategory } from '@/services/userServices'
import { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { useEmail } from '@/components/EmailContext'

const Personal: NextPage = () => {
  const {email} = useEmail();
  const [personal_task, setPersonal_task] = useState<Task[]>([])

  const fetchHealthTask = async () => {
    try {
      const personal_task = await filterByCategory('Personal', email)
      setPersonal_task(personal_task)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchHealthTask()
  }, [])

  return (
    <>
      <div className="bg-custom-black min-h-screen">
        <MainLayout className="lg:hidden">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-8">
              <NavBar />
              {/* <SearchBar /> */}
            </div>
            <div className="gap-1 items-center flex flex-col text-custom-white font-medium">
              <p className="text-xl">Personal</p>
              <p className="text-base">{personal_task.length} Tasks</p>
            </div>

            <div className="flex flex-col gap-4 bg-custom-white rounded-lg p-4">
              {personal_task.map((item, index) => (
                <TaskItem
                  key={index}
                  task_id={item.task_id}
                  priority={item.priority}
                  title={item.title}
                  date_start={item.date_start}
                  date_end={item.date_end}
                  note={item.note}
                  time_start={item.time_start}
                  time_end={item.time_end}
                />
              ))}
            </div>
          </div>
        </MainLayout>

        {/* Desktop */}
        <div className="hidden lg:block min-h-screen">
          <div className="flex flex-row gap-10 py-10">
            <NavBar />
            <div className="flex flex-col w-full px-52 gap-8">
              {/* <SearchBar /> */}
              <div className="gap-1 items-center flex flex-col text-custom-white font-medium">
                <p className="text-2xl">Personal</p>
                <p className="text-xl">{personal_task.length} Task</p>
              </div>
              <div className="flex flex-col gap-4 bg-custom-white rounded-lg p-4">
                {personal_task.map((item, index) => (
                  <TaskItem
                    key={index}
                    task_id={item.task_id}
                    priority={item.priority}
                    title={item.title}
                    date_start={item.date_start}
                    date_end={item.date_end}
                    note={item.note}
                    time_start={item.time_start}
                    time_end={item.time_end}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        <Footer className="text-custom-white" />
      </div>
    </>
  )
}
export default Personal
