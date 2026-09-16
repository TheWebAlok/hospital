import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Testimonials.css";

import personM9 from "../assets/img/person/person-m-9.webp";
import personF5 from "../assets/img/person/person-f-5.webp";
import personF12 from "../assets/img/person/person-f-12.webp";
import personM12 from "../assets/img/person/person-m-12.webp";
import personM13 from "../assets/img/person/person-m-13.webp";
import personF13 from "../assets/img/person/person-f-13.webp";

import personM3 from "../assets/img/person/person-m-3.webp";
import personM7 from "../assets/img/person/person-m-7.webp";
import personF9 from "../assets/img/person/person-f-9.webp";
import personF11 from "../assets/img/person/person-f-11.webp";

const featuredTestimonials = [
  {
    text:
      "Proin iaculis purus consequat sem cure digni ssim donec porttitora entum suscipit rhoncus. Accusantium quam, ultricies eget id, aliquam eget nibh et. Maecen aliquam, risus at semper.",
    image: personM9,
    name: "Marcus Chen",
    username: "@marcuschen",
  },
  {
    text:
      "Enim nisi quem export duis labore cillum quae magna enim sint quorum nulla quem veniam duis minim tempor labore quem eram duis noster aute amet eram fore quis sint minim.",
    image: personF5,
    name: "Sarah Mitchell",
    username: "@sarahmitch",
  },
  {
    text:
      "Fugiat enim eram quae cillum dolore dolor amet nulla culpa multos export minim fugiat minim velit minim dolor enim duis veniam ipsum anim magna sunt elit fore quem dolore labore.",
    image: personF12,
    name: "James Wilson",
    username: "@jwilson",
  },
  {
    text:
      "Quis quorum aliqua sint quem legam fore sunt eram irure aliqua veniam tempor noster veniam enim culpa labore duis sunt culpa nulla illum cillum fugiat legam esse veniam culpa.",
    image: personM12,
    name: "Emma Rodriguez",
    username: "@emmarod",
  },
  {
    text:
      "Export tempor illum tamen malis malis eram quae irure esse labore quem cillum quid cillum eram malis quorum velit fore eram velit sunt aliqua noster fugiat irure amet legam anim culpa.",
    image: personM13,
    name: "David Kumar",
    username: "@davidkumar",
  },
  {
    text:
      "Texit tempor illum tamen malis malis eram quae irure esse labore quem cillum quid cillum eram malis quorum velit fore eram velit sunt aliqua noster fugiat irure amet legam anim culpa.",
    image: personF13,
    name: "Sophia Lee",
    username: "@sophialee",
  },
];

const testimonials = [
  {
    text:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce posuere metus vitae arcu imperdiet, id aliquet ante scelerisque. Sed sit amet sem vitae urna fringilla tempus.",
    image: personM3,
    name: "Michael Anderson",
    role: "Software Developer",
  },
  {
    text:
      "Cras fermentum odio eu feugiat lide par naso tierra. Justo eget nada terra videa magna derita valies darta donna mare fermentum iaculis eu non diam phasellus.",
    image: personF5,
    name: "Sophia Martinez",
    role: "Marketing Specialist",
  },
  {
    text:
      "Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum.",
    image: personM7,
    name: "David Wilson",
    role: "Graphic Designer",
  },
  {
    text:
      "Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis.",
    image: personF9,
    name: "Emily Johnson",
    role: "UX Designer",
  },
  {
    text:
      "Praesent nonummy mi in odio. Nullam accumsan lorem in dui. Cras ultricies mi eu turpis hendrerit fringilla. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices.",
    image: personF11,
    name: "Olivia Thompson",
    role: "Entrepreneur",
  },
  {
    text:
      "Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium.",
    image: personM12,
    name: "James Taylor",
    role: "Financial Analyst",
  },
];

function Stars() {
  return (
    <div className="testimonial-stars">
      <i className="bi bi-star-fill"></i>
      <i className="bi bi-star-fill"></i>
      <i className="bi bi-star-fill"></i>
      <i className="bi bi-star-fill"></i>
      <i className="bi bi-star-fill"></i>
    </div>
  );
}

export default function Testimonials() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredTestimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const getVisibleSlides = () => {
    const result = [];

    for (let i = 0; i < 3; i++) {
      result.push(
        featuredTestimonials[
          (currentSlide + i) % featuredTestimonials.length
        ]
      );
    }

    return result;
  };

  return (
    <main className="testimonials-page">

      {/* =====================================================
          PAGE TITLE
      ===================================================== */}
      <div className="page-title">

        <div className="heading">
          <div className="container">

            <div className="row justify-content-center text-center">
              <div className="col-lg-8">

                <h1 className="heading-title">
                  Testimonials
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

        <nav className="breadcrumbs">
          <div className="container">

            <ol>
              <li>
                <Link to="/">Home</Link> &nbsp; / Testimonials
              </li>

              
            </ol>

          </div>
        </nav>

      </div>


      {/* =====================================================
          FEATURED TESTIMONIALS
      ===================================================== */}
      <section className="featured-testimonials section">

        <div className="container">

          <div className="featured-slider">

            <div className="featured-track">

              {getVisibleSlides().map((item, index) => (
                <div
                  className={`featured-slide ${
                    index === 0 ? "active-slide" : ""
                  }`}
                  key={`${item.name}-${index}`}
                >

                  <div className="featured-testimonial-card">

                    <Stars />

                    <p>
                      {item.text}
                    </p>

                    <div className="featured-profile">

                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                      />

                      <div>

                        <h4>
                          {item.name}

                          <i className="bi bi-patch-check-fill"></i>
                        </h4>

                        <span>
                          {item.username}
                        </span>

                      </div>

                    </div>

                  </div>

                </div>
              ))}

            </div>


            {/* Pagination */}
            <div className="testimonial-pagination">

              {featuredTestimonials.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  className={
                    currentSlide === index
                      ? "active"
                      : ""
                  }
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Go to testimonial ${index + 1}`}
                ></button>
              ))}

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          ALL TESTIMONIALS
      ===================================================== */}
      <section className="testimonials section">

        <div className="container">

          <div className="row g-4">

            {testimonials.map((testimonial) => (
              <div
                className="col-lg-6"
                key={testimonial.name}
              >

                <div className="testimonial-card">

                  <Stars />

                  <p>
                    {testimonial.text}
                  </p>

                  <div className="testimonial-footer">

                    <div className="testimonial-author">

                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        loading="lazy"
                      />

                      <div>

                        <h5>
                          {testimonial.name}
                        </h5>

                        <span>
                          {testimonial.role}
                        </span>

                      </div>

                    </div>

                    <div className="quote-icon">
                      <i className="bi bi-quote"></i>
                    </div>

                  </div>

                </div>

              </div>
            ))}

          </div>

        </div>

      </section>

    </main>
  );
}