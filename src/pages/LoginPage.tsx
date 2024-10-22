import { useState } from "react";

interface Props {
    setIsLogged: (isLogged: boolean) => void;
    isLogged: boolean;
    setPage: (page: string) => void;
}

const API_URL = import.meta.env.VITE_API_URL;



const LoginPage: React.FC<Props> = ( { setIsLogged, isLogged }) => {
    
    const [errorMessage, setErrorMessage] = useState<string>("");

    const loginUser = async (e: any) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;

        const response = await fetch(`${API_URL}/user/loginUser`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({email, password})
        });
        if (!response.ok) {
            setErrorMessage("Invalid email or password!");
            return;
        }
        const data = await response.json();
        const { token, userId, userEmail } = data;
    
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);
        localStorage.setItem("userEmail", userEmail);
        setIsLogged(true);
        console.log(token);
        console.log(userId);
        setErrorMessage("You are now logged in!");
    }
    return(
        <>
        <h1>Login</h1>
        {!isLogged ? (
        <form onSubmit={loginUser}>
            <label>email</label>
            <input type="text" name="email" />
            <label>Password</label>
            <input type="password" name="password" />
            <button type="submit">Login</button>
        </form>
        ): (
            <p>Hello!</p>
        )}
        <p>{errorMessage}</p>
        
        </>
    );
}

export default LoginPage;