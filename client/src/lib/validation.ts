import { z } from 'zod'

export const postSchema = z.object({
	title: z.string().min(5),
	body: z.string().min(15),
})
