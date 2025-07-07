import { useEffect } from "react";
import { useSelector } from "react-redux";

const TawkLoader = () => {
  const { user } = useSelector((state) => state.auth);
  console.log("Current user from Redux store: ", user);
  const { cartItems } = useSelector(state => state.shopCart)
  console.log("Current cart items from Redux store: ", cartItems);

  const authorizedUser = JSON.parse(localStorage.getItem("authorized"));
  console.log("authorizedUser from TAWK : ", authorizedUser);

  useEffect(() => {
    const scriptSrc =
      "https://embed.tawk.to/6863f473260e9d190d99d9b6/1iv375oqp";

    // Function to load the Tawk.to script
    const loadTawkScript = () => {
      const existingScript = document.querySelector(
        `script[src="${scriptSrc}"]`
      );
      if (!existingScript) {
        const script = document.createElement("script");
        script.src = scriptSrc;
        script.async = true;
        script.charset = "UTF-8";
        script.setAttribute("crossorigin", "*");
        document.body.appendChild(script);

        // Wait for the script to load and initialize Tawk.to
        script.onload = () => {
          console.log("Tawk.to script loaded.");
          initializeTawkAPI();
        };
      } else {
        console.log("Tawk.to script already exists.");
        initializeTawkAPI();
      }
    };

    // Function to initialize the Tawk.to API
    const initializeTawkAPI = () => {
      const interval = setInterval(() => {
        if (window.Tawk_API?.setAttributes) {
          console.log("Initializing Tawk.to API with user details.");
          window.Tawk_API.setAttributes(
            {
              name: user?.name || "Guest",
              email: user?.email || "guest@example.com",
              cartItems: cartItems?.items?.length || 0,
              currentPage : window.location.pathname
            },
            function (error) {
              if (error) console.error("Tawk.to error:", error);
            }
          );
          window.Tawk_API.showWidget(); // Ensure the widget is visible
          clearInterval(interval); // Stop checking once initialized
        }
      }, 500); // Check every 500ms until the API is ready
    };

    // Function to remove the Tawk.to script
    const removeTawkScript = () => {
      //   const existingScript = document.querySelector(`script[src="${scriptSrc}"]`);
      //   if (existingScript) {
      //     existingScript.remove();
      //   }
      if (window.Tawk_API) {
        console.log("Hiding and removing Tawk.to widget.");
        window.Tawk_API.hideWidget();
      }
    };

    // Handle script loading based on user authentication
    if (authorizedUser) {
      console.log("Authorized user found, loading Tawk.to script.");
      loadTawkScript();
    } else {
      console.log("No authorized user found, removing Tawk.to script.");
      removeTawkScript();
    }

    return () => {
      console.log("Cleaning up TawkLoader.");
      removeTawkScript();
    };
  }, [authorizedUser, user]);

  return null;
};

export default TawkLoader;
