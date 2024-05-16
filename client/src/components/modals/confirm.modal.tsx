import { useConfirm } from '@/hooks/use-confirm'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { useMutation } from '@tanstack/react-query'
import $axios from '@/http'
import { postStore } from '@/store/post.store'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
import { AlertCircle } from 'lucide-react'
import FillLoading from '../shared/fill-loading'

function ConfirmModal() {
	const { isOpen, onClose, post } = useConfirm()
	const { setPosts, posts } = postStore()

	const { mutate, error, isPending } = useMutation({
		mutationKey: ['delete-post'],
		mutationFn: async () => {
			const { data } = await $axios.delete(`/post/delete/${post._id}`)
			return data
		},
		onSuccess: data => {
			const newData = posts.filter(c => c._id !== data._id)
			setPosts(newData)
			onClose()
		},
	})

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent>
				{error && (
					<Alert variant='destructive'>
						<AlertCircle className='h-4 w-4' />
						<AlertTitle>Error</AlertTitle>
						<AlertDescription>{error.message}</AlertDescription>
					</Alert>
				)}
				{isPending && <FillLoading />}
				<DialogHeader>
					<DialogTitle>Are you absolutely sure?</DialogTitle>
					<DialogDescription>
						This action cannot be undone. This will permanently delete your account and remove your data from our
						servers.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant={'destructive'} onClick={onClose}>
						Cancel
					</Button>
					<Button onClick={() => mutate()}>Continue</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

export default ConfirmModal
