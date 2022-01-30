enum AuthUser {
  USER = 'user',
}
enum AuthAdmin {
  ADMIN = 'admin',
}

const Auth = { ...AuthUser, ...AuthAdmin };
export { Auth, AuthUser, AuthAdmin };
