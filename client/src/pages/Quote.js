import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
const Quote = () => {
  const navigate = useNavigate();

  const [quote, setQuote] = useState("");

  function handleChange(e) {
    const value = e.target.value;
    setQuote(value);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:1337/api/quote", {
        method: "POST",
        headers: {
          "x-access-token": Cookies.get("auth-token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quote: quote }),
      });
      const data = await res.json();
      if (data.status === "success") {
        alert("Quote Updated");
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert(err.message);
    }
  }

  async function populateQuote() {
    try {
      const res = await fetch("http://localhost:1337/api/quote", {
        method: "GET",
        headers: {
          "x-access-token": Cookies.get("auth-token"),
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (data.status === "success") {
        setQuote(data.user.quote || "No Quote Found");
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert(err.message);
    }
  }

  useEffect(() => {
    const token = Cookies.get("auth-token");
    if (token) {
      const user = jwt_decode(token);
      if (!user) {
        Cookies.remove("auth-token");
        navigate("/login");
      } else {
        populateQuote(user);
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
        <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">
          Your Quote
        </p>
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-4xl dark:text-white">
          {quote}
        </h1>
      </div>
      <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          Edit Your Quote
        </h2>
        <form action="#">
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            <div className="sm:col-span-2">
              <textarea
                id="description"
                rows="3"
                onChange={handleChange}
                value={quote}
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Your Quote here"
              ></textarea>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            type="submit"
            className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
          >
            Update Quote
          </button>
        </form>
      </div>
    </section>
  );
};

export default Quote;
