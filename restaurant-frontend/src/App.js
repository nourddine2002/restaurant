import { useEffect, useState } from "react";

function App() {
    const [message, setMessage] = useState("");

    useEffect(() => {
    fetch("/message")
    .then(response => response.json())
    .then(data => setMessage(data.message))
    .catch(error => console.error("Error fetching data:", error));
    }, []);

    return <h1>{message || "Loading..."}</h1>;
}

export default App;
