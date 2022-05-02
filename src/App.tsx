import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { VIDEO_PAGE } from './global/const';
import VideoPage from './pages/Video';
import Home from './pages/Home';



const App: React.FC = (props) => {

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path={`/${VIDEO_PAGE}/:videoId`} element={<VideoPage/>}/>
            </Routes>
        </Router>
    )
}




export default App;