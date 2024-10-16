const RegisterPage = () => {
    return(
        <>
        <h1>Register account</h1>
        <form>
            <label>Email:</label>
            <input type="text" name="username" />
            <label>Password:</label>
            <input type="password" name="password" />
            <label>Repeat password:</label>
            <input type="password" name="password" />
            <button type="submit">Register</button>
        </form>
        </>
    );
}

export default RegisterPage;