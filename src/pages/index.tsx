import Image from 'next/image'
import { Inter } from 'next/font/google'
import {useContext, useState} from 'react'
import { UserContext } from '@/globalState/userState'
import { useHookstate } from '@hookstate/core'
import { Alert } from 'antd'

const inter = Inter({ subsets: ['latin'] })

export default function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const { user, setUser } = useContext(UserContext);
  const [responseApi, setResponseApi] = useState({ok: false, statusText: "", show: false})

  const handleLogin = async() => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        console.log(response)
        setResponseApi({ok: true, statusText: response.statusText, show: true})
        //setUser({id: response.user.id, username: response.user.username, isLogin: true})
        //window.location.href = '/home';
      } else {
        const data = await response.json();
        console.error('Login error:', data);
        setResponseApi({ok: false, statusText: data.message, show: true})
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  }
  return (
    <>
      {
      responseApi.show &&  
      <Alert message={responseApi.statusText} 
      type={responseApi.ok? "success": "error"} 
      closable afterClose={()=> setResponseApi({ok: false, statusText: "", show: false})}/>
    } 
    <div className='w-screen h-screen bg-purple-800 flex  items-center justify-center sm:justify-start'>
  
        <div className='lg:w-[30%] md:w-[50%] sm:w-[60%] h-[50%] bg-white rounded-xl drop-shadow-xl'>
          <div className='mt-5 text-xl font-extrabold flex justify-center mb-10 text-indigo-700	'>Login</div>
        <div className='w-[100%] h-[100%] flex flex-col items-center gap-2'>
          <input 
                className='mt-15 w-[80%] focus:outline-indigo-500 h-[10%] rounded-md border-2 px-5 py-2 text-[black]' 
                placeholder='username'
                onChange={(event) => { setUsername(event.target.value)}}/>
          <input 
                className='w-[80%] h-[10%] rounded-md border-2 px-5 py-2 text-[black]' 
                placeholder='password' type='password'
                onChange={(event) => {setPassword(event.target.value)}}/>
          <button className='mt-5 w-[80%] h-[15%] bg-purple-600 text-[#] rounded-xl' onClick={() => handleLogin()}>Login</button>
          </div>
        </div>
    </div>
    </>
  )
}
