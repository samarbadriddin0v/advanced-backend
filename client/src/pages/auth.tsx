import ForgotPassword from '@/components/auth/forgot-password'
import Login from '@/components/auth/login'
import Register from '@/components/auth/register'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/hooks/use-auth'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Auth() {
	const { authState } = useAuth()
	const navigate = useNavigate()

	useEffect(() => {
		if (localStorage.getItem('accessToken')) {
			navigate('/')
		}
	}, [])

	return (
		<div className='w-full h-screen flex justify-center items-center'>
			<Card className='w-1/3 p-3 bg-gray-900 relative'>
				<CardContent>
					{authState === 'login' && <Login />}
					{authState === 'register' && <Register />}
					{authState === 'forgot-password' && <ForgotPassword />}
				</CardContent>
			</Card>
		</div>
	)
}

export default Auth
