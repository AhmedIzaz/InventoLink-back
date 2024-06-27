type TUser = {
	id?: number
	username: string
	email: string
	password?: string | null
	contact?: string | null
	user_type_id: number
	// oauth fiels
	isOauthUser?: boolean
	oauthProvider?: TOauthProvider | null
}

type TOauthProvider = 'GOOGLE' | 'FACEBOOK' | 'LINKEDIN'

type TGoogleUser = {
	sub: string
	name: string
	given_name: string
	family_name: string
	picture: string
	email: string
	email_verified: boolean
	hd: string
}
