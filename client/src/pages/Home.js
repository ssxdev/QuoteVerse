import React, { useState, useEffect } from "react";

const Home = () => {
  const [allquote, setAllquote] = useState([]);

  async function fetchData() {
    try {
      const res = await fetch("http://localhost:1337/api/allquote", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (data.status === "success") {
        setAllquote(data.data);
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert(err.message);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <div>
        {allquote.map((quote) => (
          <div key={quote._id} className="bg-white dark:bg-gray-900">
            <div className="max-w-screen-xl px-4 py-8 mx-auto text-center lg:py-16 lg:px-6">
              <figure className="max-w-screen-md mx-auto">
                <svg
                  className="h-12 mx-auto mb-3 text-gray-400 dark:text-gray-600"
                  viewBox="0 0 24 27"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14.017 18L14.017 10.609C14.017 4.905 17.748 1.039 23 0L23.995 2.151C21.563 3.068 20 5.789 20 8H24V18H14.017ZM0 18V10.609C0 4.905 3.748 1.038 9 0L9.996 2.151C7.563 3.068 6 5.789 6 8H9.983L9.983 18L0 18Z"
                    fill="currentColor"
                  />
                </svg>
                <blockquote>
                  <p className="text-2xl font-medium text-gray-900 dark:text-white">
                    {quote.quote}
                  </p>
                </blockquote>
                <figcaption className="flex items-center justify-center mt-6 space-x-3">
                  <div className="flex items-center divide-x-2 divide-gray-500 dark:divide-gray-700">
                    <div className="pr-3 font-medium text-gray-900 dark:text-white">
                      {quote.name}
                    </div>
                  </div>
                </figcaption>
              </figure>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
