import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import Photo from "./Photo";

const clientID = `?client_id=${process.env.REACT_APP_ACCESS_KEY}`;
const mainUrl = `https://api.unsplash.com/photos/`;
const searchUrl = `https://api.unsplash.com/search/photos/`;

function App() {
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");

  const fetchImages = async () => {
    setLoading(true);
    let url;
    const urlPage = `&page=${page}`;
    const urlQuery = `&query=${query}`;

    url = query
      ? `${searchUrl}${clientID}${urlPage}${urlQuery}`
      : `${mainUrl}${clientID}${urlPage}`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      setPhotos((currData) =>
        query ? [...currData, ...data.results] : [...currData, ...data]
      );
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [page]);

  useEffect(() => {
    const event = window.addEventListener("scroll", (e) => {
      if (
        !loading &&
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 50 //allowance
      ) {
        setPage((currPage) => currPage + 1);
      }
    });

    return () => window.removeEventListener("scroll", event);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    setPhotos([]);
    fetchImages();
  };

  return (
    <main>
      <section className="search">
        <form className="search-form">
          <input
            type="text"
            placeholder="search"
            className="form-input
          "
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="submit-btn" onClick={handleSubmit}>
            <FaSearch />
          </button>
        </form>
      </section>

      <section className="photos">
        <div className="photos-center">
          {photos.map((image) => {
            return <Photo key={image.id} {...image} />;
          })}
        </div>
        {loading && <h2 className="loading">Loading...</h2>}
      </section>
    </main>
  );
}

export default App;
