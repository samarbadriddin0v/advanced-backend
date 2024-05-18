import FillLoading from '@/components/shared/fill-loading'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import $axios from '@/http'
import { passwordSchema } from '@/lib/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

function RecoveryAccount() {
	const { token } = useParams()
	const navigate = useNavigate()

	const form = useForm<z.infer<typeof passwordSchema>>({
		resolver: zodResolver(passwordSchema),
		defaultValues: { confirmPassword: '', password: '' },
	})

	const { mutate, isPending } = useMutation({
		mutationKey: ['forgot-password'],
		mutationFn: async (values: z.infer<typeof passwordSchema>) => {
			const obj = { password: values.password, token }
			const { data } = await $axios.put(`/auth/recovery-account`, obj)
			return data
		},
		onSuccess: () => {
			toast('Successfully recovered, log in to account')
			navigate('/auth')
		},
		onError: error => {
			// @ts-ignore
			toast(error.response?.data?.message)
		},
	})

	function onSubmit(values: z.infer<typeof passwordSchema>) {
		mutate(values)
	}

	return (
		<div className='w-full h-screen flex justify-center items-center'>
			<Card className='w-1/3 p-3 bg-gray-900 relative'>
				<CardContent>
					{isPending && <FillLoading />}
					<h1 className='text-2xl font-bold'>Recovery account</h1>

					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2 mt-6'>
							<FormField
								control={form.control}
								name='password'
								render={({ field }) => (
									<FormItem>
										<FormLabel>New password</FormLabel>
										<FormControl>
											<Input type='password' placeholder='****' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='confirmPassword'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Confirm password</FormLabel>
										<FormControl>
											<Input type='password' placeholder='*****' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<Button type='submit' size={'sm'}>
								Submit
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	)
}

export default RecoveryAccount
