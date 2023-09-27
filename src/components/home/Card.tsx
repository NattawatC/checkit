import React from 'react'

interface CardProps 
{
    title: string
    description: string
}

const Card : React.FunctionComponent<CardProps> = ({title, description}) => {
  return (
    <div className='flex flex-col p-4 gap-2 bg-black rounded-2xl '>
        <p className='text-white text-center  text-xl'>
            {title}
        </p>
        <p className='text-white text-center text-base'>
            {description}
        </p>
    </div>
  )
}

export default Card
