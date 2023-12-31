'use client'
import { useEmail } from '@/components/EmailContext'
import { Footer, NavBar } from '@/components/common'
import { MainLayout } from '@/components/layouts'
import ChangeName from '@/components/profilePage/ChangeName'
import {
  editUserProfile,
  getAllTaskOfUser,
  getUserInfo,
} from '@/services/userServices'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { IoIosInformationCircle } from 'react-icons/io'

const Profile = () => {
  const router = useRouter()
  const { email } = useEmail()
  const [completedTasks, setCompletedTasks] = useState<Task[]>([])
  const [isHovering, setIsHovering] = useState(false)
  const [user_info, setUser_info] = useState({
    username: '',
    email: '',
    date: '',
  })
  const onMouseEnter = () => setIsHovering(true)
  const onMouseLeave = () => setIsHovering(false)

  const fetchUserInfo = async () => {
    try {
      const res = await getUserInfo(email)
      setUser_info({
        username: res.username,
        email: res.email,
        date: res.date,
      })
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchUserInfo()
  }, [])

  const handleSaveName = async (newName: string) => {
    try {
      await editUserProfile(newName, email)
      setUser_info({ ...user_info, username: newName })
      router.reload()
    } catch (err) {
      console.log(err)
    }
  }

  const fetchAllTasks = async () => {
    try {
      const completedTasks = await getAllTaskOfUser(email, 1)
      setCompletedTasks(completedTasks)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchAllTasks()
  }, [])

  return (
    <>
      <div className="flex flex-col bg-custom-black min-h-screen">
        {/* Mobile */}
        <MainLayout className="lg:hidden">
          <div className="flex flex-col gap-8">
            <NavBar />
            <div className="flex flex-col items-start font-medium text-custom-white">
              <p className="text-xs">{user_info.date}</p>
              <p className="text-xl">See your Profile</p>
            </div>

            <div className="flex flex-row justify-between">
              <div className="flex flex-row gap-5 text-base text-custom-white">
                <p>Name:</p>
                <p>{user_info.username}</p>
              </div>
              <ChangeName onSaveName={handleSaveName} />
            </div>

            <div className="flex flex-row justify-between">
              <div className="flex flex-row gap-5 text-base text-custom-white">
                <p>Email:</p>
                <p>{user_info.email}</p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex flex-row gap-3 items-center">
                <p className="text-custom-white text-base font-medium">
                  Completed Tasks
                </p>
                <p
                  className="flex flex-row text-custom-white hover:text-custom-orange cursor-pointer items-center gap-2"
                  onMouseEnter={onMouseEnter}
                  onMouseLeave={onMouseLeave}
                >
                  <IoIosInformationCircle />
                  {isHovering ? (
                    <span className="text-xs font-medium">
                      This will be delete after 7 days
                    </span>
                  ) : (
                    <span className="text-custom-black">hidden</span>
                  )}
                </p>
              </div>
              <div className="flex flex-col rounded-lg gap-2 bg-custom-gray text-custom-white p-4">
                {completedTasks.map((task, index) => (
                  <p key={index}>{task.title}</p>
                ))}
              </div>
            </div>
          </div>
        </MainLayout>
        {/* Desktop */}
        <div className="hidden lg:block min-h-screen">
          <div className="flex flex-row gap-10 py-10">
            <NavBar />
            <div className="flex flex-col gap-8 w-full px-10">
              <div className="flex flex-col items-start font-medium text-custom-white">
                <p className="text-xl">{user_info.date}</p>
                <p className="text-3xl">See your Profile</p>
              </div>
              <div className="flex flex-col gap-8 px-40">
                <div className="flex flex-row justify-between">
                  <div className="flex flex-row gap-5 text-xl text-custom-white">
                    <p>Name:</p>
                    <p>{user_info.username}</p>
                  </div>
                  <ChangeName onSaveName={handleSaveName} />
                </div>

                <div className="flex flex-row justify-between">
                  <div className="flex flex-row gap-5 text-xl text-custom-white">
                    <p>Email:</p>
                    <p>{user_info.email}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex flex-row gap-3 items-center">
                    <p className="text-custom-white text-xl font-medium">
                      Completed Tasks
                    </p>
                    <p
                      className="flex flex-row text-custom-white hover:text-custom-orange cursor-pointer items-center gap-2"
                      onMouseEnter={onMouseEnter}
                      onMouseLeave={onMouseLeave}
                    >
                      <IoIosInformationCircle className="h-5 w-5" />
                      {isHovering ? (
                        <span className="text-lg font-medium">
                          This will be delete after 7 days
                        </span>
                      ) : (
                        <span className="text-custom-black">hidden</span>
                      )}
                    </p>
                  </div>
                  {/* TODO: Retrive completed task from backend */}
                  <div className="flex flex-col rounded-lg gap-2 bg-custom-gray text-custom-white p-4 text-xl">
                    {completedTasks.map((task, index) => (
                      <p key={index}>{task.title}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer className="text-custom-white" />
      </div>
    </>
  )
}

export default Profile
