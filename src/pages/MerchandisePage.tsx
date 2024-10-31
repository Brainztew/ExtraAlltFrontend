import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;
const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

interface item {
    itemId: string;
    title: string;
    price: number;
    description: string;
    stock: number;
    productImage: string;
}

const MerchandisePage = () => {

    const [items, setItems] = useState<item[]>([]);
    const [cart, setCart] = useState<item[]>([]);
    const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
    const itemsIncart = cart.reduce((total, item) => total + item.stock, 0);

    
    const getMerchandise = async () => {
        const response = await fetch(`${API_URL}/item/getItems`); 
        if (!response.ok) {
            alert("Failed to load merchandise");
            return;
        }
        const data = await response.json();
        console.log(data);
        setItems(data);
    }

    useEffect(() => {
        getMerchandise();
    }, []);

    const addToCart = (item: item) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find(cartItem => cartItem.itemId === item.itemId);
            if (existingItem) {
                return prevCart.map(cartItem =>
                    cartItem.itemId === item.itemId
                        ? { ...cartItem, stock: cartItem.stock + 1 }
                        : cartItem
                );
            } else {
                return [...prevCart, { ...item, stock: 1 }];
            }
        });
    };

    const calculateTotal = ()  =>{
        return cart.reduce((total, item) => total + item.price * item.stock, 0);
    };

    const toggleCart = () => {
        setIsCartOpen(!isCartOpen);
    }

    const emptyCart = () => {
        setCart([]);
    }

    const checkout = async () => {
        const stripe = await loadStripe(STRIPE_PUBLIC_KEY);
        console.log(cart);
        

        const response = await fetch(`${API_URL}/stripe/checkout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                items: cart.map((item) => ({
                    itemId: item.itemId,
                    title: item.title,
                    quantity: item.stock,
                    price: item.price,
                })),
            }),
        });
        const data = await response.json();

        if (!stripe) {
            alert("Stripe failed to load");
            return;
        }

        const result = await stripe.redirectToCheckout({
            sessionId: data.sessionId,
        });
        if (result?.error) {
            alert(result.error.message);
    }
};



    return (
        <>
            <p>Here you can buy merchandise to support this site!</p>
            <button onClick={toggleCart}>
                <img id="cartLoggo" src="/pictures/chartIcon.png" alt="cart" />
                Cart ({itemsIncart})
                </button> 
                {isCartOpen && (          
            <div className="cart">
                <h2>Cart</h2>
                {cart.map((item) => (
                    <div key={item.itemId}>
                        <h3>{item.title}</h3>
                        <p>Price: {item.price} USD</p>
                        <p>Quantity: {item.stock}</p>
                    </div>
                )
                )}
                <p>Total: {calculateTotal()} USD</p>
                <button onClick={emptyCart} className="buyBtn">Empty cart</button>
                <button onClick={checkout} className="buyBtn">Proceed to checkout</button>
            </div>
            )}
           {!isCartOpen && (
            <div>
            {items.map((item) => (
                <div className="productBox" key={item.itemId}>
                    <h3>{item.title}</h3>
                    <p>Price: {item.price} USD</p>
                    <p>Description: {item.description}</p>
                    <p>Stock: {item.stock}</p>
                    <img id="productImage" src={item.productImage} alt={item.title} />
                    <button className="buyBtn" onClick={() => addToCart(item)}> Buy</button>
                </div>
            ))}
            
            </div>
            )}
       </>
    );
};

export default MerchandisePage;