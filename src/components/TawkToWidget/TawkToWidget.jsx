import { useEffect, useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import { auth } from "../../firebase";

const TawkToWidget = () => {
  const { userId } = useContext(StoreContext);

  useEffect(() => {
    const s1 = document.createElement("script");
    s1.src = import.meta.env.VITE_TAWKTO_WIDGET_URL;
    s1.async = true;
    s1.charset = "UTF-8";
    s1.setAttribute("crossorigin", "*");
    document.body.appendChild(s1);

    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_API.onLoad = function () {
      const user = auth.currentUser;
      if (user) {
        window.Tawk_API.setAttributes({
          name: user.displayName || "Customer",
          email: user.email || `user_${user.uid}@app.com`,
        }, function (error) {
          if (error) console.error("Tawk.to setAttributes error:", error);
        });
      }
    };

    return () => {
      document.body.removeChild(s1);
    };
  }, [userId]);

  return null;
};

export default TawkToWidget;
