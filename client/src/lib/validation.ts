import { z } from 'zod'

export const postSchema = z.object({
	title: z.string().min(5),
	body: z.string().min(15),
})

export const authSchema = z.object({
	email: z.string().email(),
	password: z.string().min(3).max(30),
})
