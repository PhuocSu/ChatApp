import { BrowserRouter, Routes, Route } from "react-router-dom"
import SignInPage from "./pages/SignInPage.js"
import SignUpPage from "./pages/SignUpPage.js"
import ChatAppPage from "./pages/ChatAppPage.js"
import { Toaster } from "sonner"
import ProtectedRoute from "./components/auth/ProtectedRoute"
import { useThemeStore } from "./stores/useThemeStore.js"
import { useAuthStore } from "./stores/useAuthStore.js"
import { useSocketStore } from "./stores/useSocketStore.js"
import { useEffect } from "react"

function App() {
  const { isDark, setTheme } = useThemeStore();
  const { accessToken } = useAuthStore();
  const { connectSocket, disconnectSocket } = useSocketStore();

  useEffect(() => {
    setTheme(isDark);
  }, [isDark]);

  useEffect(() => {
    if (accessToken) {
      connectSocket();
    }

    return () => disconnectSocket();
  }, [accessToken]);

  return (
    <>
      <Toaster richColors />
      <BrowserRouter>
        <Routes>

          {/* public routes */}
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<ChatAppPage />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
