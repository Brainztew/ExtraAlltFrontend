interface Props {
    setPage: (page: string) => void;
}

function Menu (props: Props) {

    return(
    <>
    <button onClick={() => props.setPage("LoginPage")}>Login</button>
    <button onClick={() => props.setPage("RegisterPage")}>Register account</button>
    <button onClick={() => props.setPage("AboutPage")}>About site</button>
    <button onClick={() => props.setPage("MerchandisePage")}>Merchandise</button>
    </>
    );   
}

export default Menu;