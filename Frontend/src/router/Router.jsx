import { BrowserRouter as AppRouter, Routes, Route } from 'react-router-dom';
import Auth from '../views/auth/Auth';
import Chat from '../views/chat/Chat';


export const Router = () => {
    return (
        <AppRouter>
            <Routes>
                <Route path="/" element={<h1>Home</h1>} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/auth/success" element={<h1>Success</h1>} />
                <Route path="/chat" element={<Chat />} />
                <Route path="*" element={<h1>404 Not Found</h1>} />
            </Routes>
        </AppRouter>
    )
}

