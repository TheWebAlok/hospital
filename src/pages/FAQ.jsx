import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./FAQ.css";

const faqs = [
  {
    question:
      "Donec sollicitudin molestie malesuada proin eget tortor?",
    answer:
      "Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem. Donec rutrum congue leo eget malesuada. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae.",
  },
  {
    question:
      "Sed porttitor lectus nibh vivamus magna justo?",
    answer:
      "Nulla porttitor accumsan tincidunt. Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a. Cras ultricies ligula sed magna dictum porta. Vivamus suscipit tortor eget felis porttitor volutpat.",
  },
  {
    question:
      "Pellentesque habitant morbi tristique senectus?",
    answer:
      "Quisque velit nisi, pretium ut lacinia in, elementum id enim. Vestibulum ac diam sit amet quam vehicula elementum sed sit amet dui. Donec sollicitudin molestie malesuada.",
  },
  {
    question:
      "Lorem ipsum dolor sit amet consectetur adipiscing?",
    answer:
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium. Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto.",
  },
  {
    question:
      "Curabitur aliquet quam id dui posuere blandit?",
    answer:
      "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati.",
  },
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <main className="faq-page">

      {/* ================= PAGE TITLE ================= */}
      <div className="page-title">

        <div className="heading">
          <div className="container">

            <div className="row justify-content-center text-center">
              <div className="col-lg-8">

                <h1 className="heading-title">
                  Frequently Asked Questions
                </h1>

                <p className="mb-0">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Ut elit tellus, luctus nec ullamcorper mattis, pulvinar
                  dapibus leo.
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
                <Link to="/">Home</Link>  &nbsp;/ FAQ
              </li>

              
            </ol>

          </div>
        </nav>

      </div>


      {/* ================= FAQ SECTION ================= */}
      <section className="faq section">

        <div className="container">

          <div className="row justify-content-center">

            <div className="col-lg-9">

              <div className="faq-wrapper">

                {faqs.map((faq, index) => {
                  const isActive = activeIndex === index;

                  return (
                    <div
                      className={`faq-item ${
                        isActive ? "faq-active" : ""
                      }`}
                      key={index}
                    >

                      {/* FAQ HEADER */}
                      <button
                        type="button"
                        className="faq-header"
                        onClick={() => toggleFAQ(index)}
                        aria-expanded={isActive}
                      >

                        <span className="faq-number">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <h4>
                          {faq.question}
                        </h4>

                        <span className="faq-toggle">

                          {isActive ? (
                            <i className="bi bi-dash"></i>
                          ) : (
                            <i className="bi bi-plus"></i>
                          )}

                        </span>

                      </button>


                      {/* FAQ CONTENT */}
                      <div
                        className={`faq-content ${
                          isActive ? "show" : ""
                        }`}
                      >
                        <div className="content-inner">
                          <p>
                            {faq.answer}
                          </p>
                        </div>
                      </div>

                    </div>
                  );
                })}

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}