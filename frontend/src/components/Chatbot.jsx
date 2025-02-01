import { useState, useEffect } from "react";

const Chatbot = () => {
    const [tarsLoaded, setTarsLoaded] = useState(false); // Track if Tars is loaded

    // Function to load the Tars chatbot script dynamically
    const loadTarsChatbot = () => {
        if (!tarsLoaded) {
            const script = document.createElement("script");
            script.id = "tars-widget-script";
            script.type = "text/javascript";
            script.src = "https://tars-file-upload.s3.amazonaws.com/bulb/js/widget.js";
            script.onload = () => {
                setTarsLoaded(true); // Mark Tars as loaded

                // Inject custom CSS to change the bot's avatar image
                const style = document.createElement("style");
                style.innerHTML = `
                    #tars-widget .bot-avatar {
                        background-image: url('https://your-image-url.com/your-image.png') !important;
                        background-size: cover;
                        background-position: center;
                    }
                `;
                document.head.appendChild(style);
            };
            document.body.appendChild(script);
            window.tarsSettings = { convid: "Y3LPi8" }; // Set the conversation ID from Tars
        }
    };

    // Load the Tars chatbot once the component is mounted
    useEffect(() => {
        loadTarsChatbot();
    }, []);

    return <div className="relative"></div>;
};

export default Chatbot;
