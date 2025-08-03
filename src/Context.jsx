import { createContext, useContext, useEffect } from "react"
import UseFetch from "./hooks/UseFetch"
import { getCurrentUser } from "./db/apiAuth"

const UrlContext = createContext()

const UrlProvider = ({ children }) => {
  const { data: user, loading, fn: fetchUser } = UseFetch(getCurrentUser)
  const isAuthenticated = user?.role === "authenticated"
  
  const frontendUrl = import.meta.env.VITE_FRONTEND_URL

  useEffect(() => {
    fetchUser()
  }, [])

  return (
    <UrlContext.Provider value={{ user, fetchUser, loading, isAuthenticated, frontendUrl }}>
      {children}
    </UrlContext.Provider>
  )
}

export const UrlState = () => {
  return useContext(UrlContext)
}

export default UrlProvider
