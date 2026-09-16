import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Gallery.css";

import gallery1 from "../assets/img/gallery/gallery-1.webp";
import gallery2 from "../assets/img/gallery/gallery-2.webp";
import gallery3 from "../assets/img/gallery/gallery-3.webp";
import gallery4 from "../assets/img/gallery/gallery-4.webp";
import gallery5 from "../assets/img/gallery/gallery-5.webp";
import gallery6 from "../assets/img/gallery/gallery-6.webp";
import gallery7 from "../assets/img/gallery/gallery-7.webp";
import gallery8 from "../assets/img/gallery/gallery-8.webp";

const galleryImages = [
  { image: gallery1, title: "Gallery 1" },
  { image: gallery2, title: "Gallery 2" },
  { image: gallery3, title: "Gallery 3" },
  { image: gallery4, title: "Gallery 4" },
  { image: gallery5, title: "Gallery 5" },
  { image: gallery6, title: "Gallery 6" },
  { image: gallery7, title: "Gallery 7" },
  { image: gallery8, title: "Gallery 8" },
];

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <main className="gallery-page">

      {/* ================= PAGE TITLE ================= */}
      <div className="page-title">

        <div className="heading">
          <div className="container">

            <div className="row justify-content-center text-center">
              <div className="col-lg-8">

                <h1 className="heading-title">
                  Gallery
                </h1>

                <p className="mb-0">
                  Odio et unde deleniti. Deserunt numquam exercitationem.
                  Officiis quo odio sint voluptas consequatur ut a odio
                  voluptatem. Sit dolorum debitis veritatis natus dolores.
                  Quasi ratione sint. Sit quaerat ipsum dolorem.
                </p>

              </div>
            </div>

          </div>
        </div>


        {/* Breadcrumb */}
        <nav className="breadcrumbs">
          <div className="container">

            <ol>

              <li>
                <Link to="/">
                  Home
                </Link>  &nbsp; / Gallery
              </li>

              

            </ol>

          </div>
        </nav>

      </div>


      {/* ================= GALLERY ================= */}
      <section className="gallery section">

        <div className="container-fluid">

          <div className="row gy-4 justify-content-center">

            {galleryImages.map((item, index) => (

              <div
                className="col-xl-3 col-lg-4 col-md-6"
                key={item.title}
              >

                <div className="gallery-item">

                  <img
                    src={item.image}
                    className="img-fluid"
                    alt={item.title}
                  />


                  {/* Hover overlay */}
                  <div className="gallery-links">

                    {/* Preview */}
                    <button
                      type="button"
                      className="gallery-preview"
                      onClick={() =>
                        setSelectedImage(item.image)
                      }
                      aria-label={`Preview ${item.title}`}
                    >
                      <i className="bi bi-arrows-angle-expand"></i>
                    </button>


                    {/* Details */}
                    <Link
                      to="/gallery-single"
                      className="gallery-details"
                      aria-label={`${item.title} details`}
                    >
                      <i className="bi bi-link-45deg"></i>
                    </Link>

                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* ================= IMAGE LIGHTBOX ================= */}
      {selectedImage && (

        <div
          className="gallery-lightbox"
          onClick={() => setSelectedImage(null)}
        >

          <button
            type="button"
            className="lightbox-close"
            onClick={() => setSelectedImage(null)}
            aria-label="Close image"
          >
            <i className="bi bi-x-lg"></i>
          </button>

          <img
            src={selectedImage}
            alt="Gallery preview"
            onClick={(e) => e.stopPropagation()}
          />

        </div>

      )}

    </main>
  );
}