interface Props {
    setPage: (page: string) => void;
    isLogged: boolean;
    setIsLogged: (isLogged: boolean) => void;
}

function Menu (props: Props) {
    const logout = () => {
        localStorage.removeItem("token");
        props.setIsLogged(false);
        props.setPage("AboutPage");
    }

    return(
    <>
        {!props.isLogged ? (
            <>
            <button onClick={() => props.setPage("LoginPage")}>Login</button>
            <button onClick={() => props.setPage("RegisterPage")}>Register account</button>
            
            </>
            ) : (
                <>
                <button onClick={logout}>Logout</button>
                <button onClick={() => props.setPage("TopicPage")}>Topic Page</button>
                </>

        )}
        <button onClick={() => props.setPage("AboutPage")}>About site</button>
        <button onClick={() => props.setPage("MerchandisePage")}>Merchandise</button>
    </>
    );   
}

export default Menu;