const LoginPage = () => {
    return(
        <>
        <h1>Login</h1>
        <form>
            <label>Username</label>
            <input type="text" name="username" />
            <label>Password</label>
            <input type="password" name="password" />
            <button type="submit">Login</button>
        </form>
        </>
    );
}

export default LoginPage;