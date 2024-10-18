const API_URL = import.meta.env.VITE_API_URL;

const RegisterPage = () => {

    const register = async (event: any) => {
        event.preventDefault();
        const email = event.target.email.value;
        const password = event.target.password.value;
        const repeatPassword = event.target.repeatPassword.value;

        if (password !== repeatPassword) {
            alert("Passwords do not match");
            return;
        }
        try {
            const response = await fetch(`${API_URL}/user/registerUser`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            alert(errorText);
            return;
        }
            alert("Account created");
            event.target.email.value = "";
            event.target.password.value = "";
            event.target.repeatPassword.value = "";
                
    } catch (error) {
        console.error(error);
        alert("An error occurred");
    }
    }

    return(
        <>
        <h1>Register account</h1>
        <form onSubmit={register}>
            <label>Email:</label>
            <input type="email" name="email" />
            <label>Password:</label>
            <input type="password" name="password" />
            <label>Repeat password:</label>
            <input type="password" name="repeatPassword" />
            <button type="submit">Register</button>
        </form>
        </>
    );
}

export default RegisterPage;