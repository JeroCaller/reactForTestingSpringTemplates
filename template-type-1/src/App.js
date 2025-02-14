import { Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import SignUp from './pages/SignUp';
import MyPages from './pages/MyPages';
import Main from './pages/Main';
import AuthChecker from './pages/components/AuthChecker';
import axios from 'axios';
import FileUpload from './pages/FileUpload';
import Profile from './pages/Profile';

/**
 * 
 * @returns 
 */
function App() {
  
  axios.defaults.withCredentials = true;

  return (
    <div className="App">
      <nav>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/mypage" element={<AuthChecker pageComponent={<MyPages />} />} />
          <Route path="/upload" element={<AuthChecker pageComponent={<FileUpload />} />} />
          <Route path="/profile" element={<AuthChecker pageComponent={<Profile />} />} />
        </Routes>
      </nav>
    </div>
  );
}

export default App;
