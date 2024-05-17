import { AuthType } from '@/interfaces'
import { create } from 'zustand'

type AuthStore = {
	authState: AuthType
	setAuth: (state: AuthType) => void
}

export const useAuth = create<AuthStore>(set => ({
	authState: 'login',
	setAuth: state => set({ authState: state }),
}))
