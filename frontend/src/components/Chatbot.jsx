import { useState, useEffect } from "react";

const Chatbot = () => {
    const [tarsLoaded, setTarsLoaded] = useState(false);

    useEffect(() => {
        if (!tarsLoaded) {
            (function(){
                var js, fs, d = document, id = "tars-widget-script", b = "https://tars-file-upload.s3.amazonaws.com/bulb/";
                if (!d.getElementById(id)) {
                    js = d.createElement("script");
                    js.id = id;
                    js.type = "text/javascript";
                    js.src = b + "js/widget.js";
                    js.onload = () => setTarsLoaded(true);
                    fs = d.getElementsByTagName("script")[0];
                    fs.parentNode.insertBefore(js, fs);
                }
            })();
            
            window.tarsSettings = { convid: "Y3LPi8" };
        }
    }, [tarsLoaded]);

    return <div className="relative"></div>;
};

export default Chatbot;
