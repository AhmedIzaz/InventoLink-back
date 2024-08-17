type TToken = TUser & {userType:TUserType}
type TUser = {
	id?: number
	username: string
	email: string
	password?: string | null
	contact: string | null
	user_type_id: number
	// oauth fiels
	isOauthUser: boolean
	oauthProvider: TOauthProvider | null
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

type TUserType = {
	id: number
	name: string
	formated_name: string
}

type TUserTypes = "ADMIN" | "SALES_STAFF" | "WAREHOUSE_STAFF"