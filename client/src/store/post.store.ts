import { IPost } from '@/interfaces'
import { create } from 'zustand'

type PostStoreType = {
	posts: IPost[]
	setPosts: (posts: IPost[]) => void
}

export const postStore = create<PostStoreType>(set => ({
	posts: [],
	setPosts: posts => set({ posts }),
}))
