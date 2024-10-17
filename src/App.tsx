import { useEffect, useState } from 'react'
import './App.css'
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import MerchandisePage from './pages/MerchandisePage';
import RegisterPage from './pages/RegisterPage';
import TopicPage from './pages/TopicPage';
import Menu from './components/Menu';

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
      default:
        return <AboutPage />;
    }
  }


  return (
    <>
      <h1>Ask A Bot</h1>
      <h3>A friend when no one else can! </h3>
      <Menu setPage={setPage} isLogged={isLogged} setIsLogged={setIsLogged}/>
      {renderPage()}
    </>
  )
}

export default App