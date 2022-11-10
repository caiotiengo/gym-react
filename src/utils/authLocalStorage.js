const LOCAL_STORAGE_USER_KEY = 'sylviaGymCurrentUser'

export const getUserInLocalStorage = () => {
  const user = JSON.parse(localStorage.getItem(LOCAL_STORAGE_USER_KEY))
  
  return user || null
}

export const setUserInLocalStorege = (user) => {
  localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user))
}