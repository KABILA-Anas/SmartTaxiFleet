import {string} from "prop-types";

export interface AuthResponse {
	refreshToken: string
	user: User
	accessToken: string
}

export interface User {
	id: number
	email: string
	firstName: string
	lastName: string
	phone: string
	cin: string
	enabled: boolean
	createdAt: string
	updatedAt: string
	authorities: Authority[]
	accountNonExpired: boolean
	credentialsNonExpired: boolean
	username: string
	accountNonLocked: boolean
}

export interface LoginUser {
	username: string
	password: string
}

export interface Authority {
	authority: string
}
