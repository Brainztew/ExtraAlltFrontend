import { useEffect, useState } from 'react'
import './App.css'
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import MerchandisePage from './pages/MerchandisePage';
import RegisterPage from './pages/RegisterPage';
import TopicPage from './pages/TopicPage';
import Menu from './components/Menu';
import { StompSessionProvider } from "react-stomp-hooks";
import SuccessPage from './pages/SuccessPage';
import CancelPage from './pages/CancelPage';
import DigitalArtPage from './pages/DigitalArtPage';

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [page, setPage] = useState<string>("");
  const [isLogged, setIsLogged] = useState<boolean>(!!localStorage.getItem("token"));

  useEffect(() => {
    let pageUrl = page;

    if (!pageUrl) {
      const queryParameters = new URLSearchParams(window.location.search);
      const getUrl = queryParameters.get("page");

      if (getUrl) {
        pageUrl = getUrl;
        setPage(getUrl);
      } else {
        pageUrl = "start";
      }
    }

    window.history.pushState(null, "", "?page=" + pageUrl);
  }, [page]);

  const renderPage = () => {
    switch (page) {
      case "AboutPage":
        return <AboutPage />;
      case "LoginPage":
        return <LoginPage setPage={setPage} setIsLogged= {setIsLogged} isLogged={isLogged}/>;
      case "MerchandisePage":
        return <MerchandisePage />;
      case "RegisterPage":
        return <RegisterPage />;
      case "TopicPage":
        return <TopicPage />;
      case "SuccessPage":
        return <SuccessPage />
      case "CancelPage":
        return <CancelPage />
      case "DigitalArtPage":
        return <DigitalArtPage />;
      default:
        return <AboutPage />;
    }
  }


  return (
    <>

      <h1>Ask A Bot</h1>
      <h3>A friend when no one else can! </h3>      
      <StompSessionProvider url={`${API_URL}/ws-endpoint`}>
        <Menu setPage={setPage} isLogged={isLogged} setIsLogged={setIsLogged}/>
        {renderPage()}
      </StompSessionProvider>
      
      <footer className="footer">
      <p>&copy; 2024 Ask A Bot. All rights reserved.</p>
      </footer>
    </>
  )
}



export default App
