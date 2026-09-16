
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Brain,
  Activity,
  Stethoscope,
  HeartPulse,
  Eye,
  Scissors,
  ShieldCheck,
  Clock,
  Bone,
  Baby,
  HandHeart,
  Ribbon,
  ArrowRight,
  Search,
  Moon,
  Heart,
  FileText,
} from "lucide-react";

import neurology3 from "../assets/img/health/neurology-3.webp";
import surgery2 from "../assets/img/health/surgery-2.webp";
import dermatology1 from "../assets/img/health/dermatology-1.webp";
import pediatrics4 from "../assets/img/health/pediatrics-4.webp";
import cardiology3 from "../assets/img/health/cardiology-3.webp";

import neurology2 from "../assets/img/health/neurology-2.webp";
import orthopedics4 from "../assets/img/health/orthopedics-4.webp";
import pediatrics3 from "../assets/img/health/pediatrics-3.webp";
import dermatology4 from "../assets/img/health/dermatology-4.webp";
import oncology2 from "../assets/img/health/oncology-2.webp";

import "./Departments.css";

const tabs = [
  {
    id: "neurology",
    name: "Neurology",
    title: "Neurological Sciences Department",
    image: neurology3,
    description:
      "Our neurology team provides comprehensive diagnosis and treatment for neurological conditions using modern technology and personalized care.",
    services: [
      {
        icon: Brain,
        title: "Brain Monitoring",
        text: "Advanced monitoring and assessment for neurological conditions.",
      },
      {
        icon: Activity,
        title: "EEG Testing",
        text: "Specialized EEG testing to evaluate brain activity and neurological disorders.",
      },
      {
        icon: Stethoscope,
        title: "Neurological Exam",
        text: "Detailed neurological examinations performed by experienced specialists.",
      },
      {
        icon: FileText,
        title: "Treatment Plans",
        text: "Personalized treatment plans based on each patient's condition.",
      },
    ],
  },
  {
    id: "surgery",
    name: "Surgery",
    title: "Surgical Services Department",
    image: surgery2,
    description:
      "Our surgical department provides advanced procedures with a focus on patient safety, precision, and comfortable recovery.",
    services: [
      {
        icon: Scissors,
        title: "Minimally Invasive",
        text: "Modern minimally invasive procedures designed to support faster recovery.",
      },
      {
        icon: Activity,
        title: "Advanced Procedures",
        text: "Advanced surgical techniques performed by experienced specialists.",
      },
      {
        icon: ShieldCheck,
        title: "Safe Operations",
        text: "High standards of safety and quality throughout surgical care.",
      },
      {
        icon: Clock,
        title: "Recovery Support",
        text: "Dedicated post-operative care and recovery support.",
      },
    ],
  },
  {
    id: "dental",
    name: "Dental Care",
    title: "Dental Care Department",
    image: dermatology1,
    description:
      "Complete dental care focused on maintaining healthy teeth, gums, and a confident smile.",
    services: [
      {
        icon: Heart,
        title: "Oral Health",
        text: "Comprehensive oral health assessments and preventive care.",
      },
      {
        icon: Search,
        title: "Teeth Cleaning",
        text: "Professional dental cleaning for healthier teeth and gums.",
      },
      {
        icon: Activity,
        title: "Cosmetic Dentistry",
        text: "Modern cosmetic dentistry options for a confident smile.",
      },
      {
        icon: Stethoscope,
        title: "Orthodontics",
        text: "Specialized orthodontic care for proper alignment and oral health.",
      },
    ],
  },
  {
    id: "ophthalmology",
    name: "Ophthalmology",
    title: "Ophthalmology Department",
    image: pediatrics4,
    description:
      "Comprehensive eye care services ranging from vision testing to advanced treatment options.",
    services: [
      {
        icon: Eye,
        title: "Vision Testing",
        text: "Detailed vision examinations to identify and manage eye conditions.",
      },
      {
        icon: Search,
        title: "Retinal Imaging",
        text: "Advanced retinal imaging for accurate eye health assessment.",
      },
      {
        icon: Activity,
        title: "Laser Surgery",
        text: "Modern laser-based procedures performed by trained specialists.",
      },
      {
        icon: FileText,
        title: "Eye Care Plans",
        text: "Personalized eye care plans based on your individual needs.",
      },
    ],
  },
  {
    id: "cardiology",
    name: "Cardiology",
    title: "Cardiology Department",
    image: cardiology3,
    description:
      "Expert cardiovascular care with modern diagnostic tools and personalized treatment.",
    services: [
      {
        icon: HeartPulse,
        title: "Heart Monitoring",
        text: "Continuous and detailed monitoring to evaluate heart health.",
      },
      {
        icon: Activity,
        title: "ECG Analysis",
        text: "Accurate ECG analysis by experienced cardiac specialists.",
      },
      {
        icon: Activity,
        title: "Blood Tests",
        text: "Essential diagnostic blood tests supporting cardiovascular care.",
      },
      {
        icon: ShieldCheck,
        title: "Preventive Care",
        text: "Preventive strategies to support long-term heart health.",
      },
    ],
  },
];

const departments = [
  {
    name: "Cardiology",
    icon: HeartPulse,
    image: cardiology3,
    text: "Comprehensive heart care with advanced diagnostic tools and expert cardiologists dedicated to your cardiovascular health.",
  },
  {
    name: "Neurology",
    icon: Brain,
    image: neurology2,
    text: "Advanced treatment for neurological disorders with cutting-edge technology and specialized neurological care teams.",
  },
  {
    name: "Orthopedics",
    icon: Bone,
    image: orthopedics4,
    text: "Expert bone and joint care offering comprehensive treatment from sports injuries to complex reconstructive surgery.",
  },
  {
    name: "Pediatrics",
    icon: Baby,
    image: pediatrics3,
    text: "Specialized medical care for infants, children, and adolescents with compassionate pediatric specialists.",
  },
  {
    name: "Dermatology",
    icon: HandHeart,
    image: dermatology4,
    text: "Complete skin care services from medical dermatology to cosmetic procedures for healthy, beautiful skin.",
  },
  {
    name: "Oncology",
    icon: Ribbon,
    image: oncology2,
    text: "Comprehensive cancer care with a multidisciplinary approach and latest treatment options.",
  },
];

export default function Departments() {
  const [activeTab, setActiveTab] = useState("neurology");

  const activeDepartment = tabs.find((tab) => tab.id === activeTab);

  return (
    <main className="main departments-page">
      {/* PAGE TITLE */}
      <div className="page-title">
        <div className="heading">
          <div className="container">
            <div className="row justify-content-center text-center">
              <div className="col-lg-8">
                <h1 className="heading-title">Departments</h1>

                <p className="mb-0">
                  Explore our specialized medical departments providing
                  advanced treatment, experienced specialists, and
                  compassionate care for every patient.
                </p>
              </div>
            </div>
          </div>
        </div>

        <nav className="breadcrumbs">
          <div className="container">
            <ol>
              <li>
                <Link to="/">Home</Link>  &nbsp; / Departments
              </li>
            </ol>
          </div>
        </nav>
      </div>

      {/* DEPARTMENT TABS */}
      <section className="departments-tabs section">
        <div className="container">
          <div className="medical-specialties">
            <div className="specialty-navigation">
              <div className="department-tab-list">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    className={`department-tab ${
                      activeTab === tab.id ? "active" : ""
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.name}
                  </button>
                ))}
              </div>
            </div>

            {/* ACTIVE DEPARTMENT */}
            <div className="department-content">
              <div className="row department-layout align-items-center">
                <div className="col-lg-4 order-lg-2">
                  <div className="department-image">
                    <img
                      src={activeDepartment.image}
                      alt={activeDepartment.name}
                      className="img-fluid"
                    />
                  </div>
                </div>

                <div className="col-lg-8 order-lg-1">
                  <div className="department-info">
                    <h2 className="department-title">
                      {activeDepartment.title}
                    </h2>

                    <p className="department-description">
                      {activeDepartment.description}
                    </p>

                    <div className="row mt-4">
                      {activeDepartment.services.map((service) => {
                        const Icon = service.icon;

                        return (
                          <div className="col-md-6" key={service.title}>
                            <div className="service-item">
                              <div className="service-icon">
                                <Icon size={25} strokeWidth={2} />
                              </div>

                              <div className="service-content">
                                <h4>{service.title}</h4>
                                <p>{service.text}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ALL DEPARTMENTS */}
      <section className="departments section">
        <div className="container">
          <div className="section-heading text-center">
            <h2>Our Departments</h2>
            <p>
              Specialized healthcare services delivered by experienced medical
              professionals.
            </p>
          </div>

          <div className="row g-5">
            {departments.map((department) => {
              const Icon = department.icon;

              return (
                <div
                  className="col-lg-4 col-md-6"
                  key={department.name}
                >
                  <div className="department-card">
                    <div className="department-icon">
                      <Icon size={30} />
                    </div>

                    <div className="department-image">
                      <img
                        src={department.image}
                        alt={`${department.name} Department`}
                        className="img-fluid"
                      />
                    </div>

                    <div className="department-content">
                      <h3>{department.name}</h3>

                      <p>{department.text}</p>

                      <Link
                        to="/department-details"
                        className="learn-more"
                      >
                        <span>Learn More</span>
                        <ArrowRight size={18} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
