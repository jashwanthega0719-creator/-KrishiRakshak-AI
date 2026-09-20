import { useState } from "react";
import {
  Leaf,
  Camera,
  CloudSun,
  Languages,
  ShieldCheck,
  Activity,
  Upload,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Droplets,
  Wind,
  ThermometerSun,
  Sprout,
  RotateCcw,
} from "lucide-react";
import "./App.css";

function App() {
  const [page, setPage] = useState("home");
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [language, setLanguage] = useState("English");
  const [loading, setLoading] = useState(false);

  const handleImage = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setImage(reader.result);
      setResult(null);
      setPage("scanner");
    };

    reader.readAsDataURL(file);
  };

  const analyzeCrop = async () => {
    if (!image) {
      alert("Please upload a crop image first.");
      return;
    }

    setLoading(true);
    setResult(null);
    setPage("result");

    try {
      const response = await fetch("http://localhost:5000/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || "Analysis failed.");
      }

      setResult(data);
    } catch (error) {
      console.error(error);

      setResult({
        error: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const resetScanner = () => {
    setImage(null);
    setResult(null);
    setPage("scanner");
  };

  return (
    <div className="app">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-container">
          <div
            className="brand"
            onClick={() => setPage("home")}
          >
            <div className="brand-icon">
              <Leaf size={24} />
            </div>

            <div>
              <h2>KrishiRakshak AI</h2>
              <span>Smart Crop Guardian</span>
            </div>
          </div>

          <div className="nav-links">
            <button onClick={() => setPage("home")}>
              Home
            </button>

            <button onClick={() => setPage("scanner")}>
              Scan Crop
            </button>

            <button onClick={() => setPage("weather")}>
              Weather
            </button>

            <button className="language-button">
              <Languages size={18} />
              {language}
            </button>
          </div>
        </div>
      </nav>

      {/* HOME */}
      {page === "home" && (
        <main>
          <section className="hero">
            <div className="hero-content">
              <div className="badge">
                <ShieldCheck size={16} />
                AI-Powered Agriculture
              </div>

              <h1>
                Protect Your Crops.
                <br />
                <span>Grow Your Future.</span>
              </h1>

              <p>
                Upload a photo of your crop leaf and let KrishiRakshak AI
                provide a preliminary visual assessment of crop health,
                possible disease, symptoms and practical actions.
              </p>

              <div className="hero-buttons">
                <button
                  className="primary-button"
                  onClick={() => setPage("scanner")}
                >
                  <Camera size={20} />
                  Scan My Crop
                  <ArrowRight size={18} />
                </button>

                <button
                  className="secondary-button"
                  onClick={() => setPage("weather")}
                >
                  <CloudSun size={20} />
                  Weather Risk
                </button>
              </div>

              <div className="hero-stats">
                <div>
                  <strong>AI</strong>
                  <span>Visual Analysis</span>
                </div>

                <div>
                  <strong>24/7</strong>
                  <span>Crop Monitoring</span>
                </div>

                <div>
                  <strong>Multi</strong>
                  <span>Language Ready</span>
                </div>
              </div>
            </div>

            <div className="hero-visual">
              <div className="crop-card">
                <div className="crop-circle">
                  <Sprout size={110} />
                </div>

                <div className="scan-ring ring-one"></div>
                <div className="scan-ring ring-two"></div>

                <div className="floating-card card-one">
                  <CheckCircle size={20} />
                  <div>
                    <strong>Early Detection</strong>
                    <span>AI visual screening</span>
                  </div>
                </div>

                <div className="floating-card card-two">
                  <Activity size={20} />
                  <div>
                    <strong>Crop Health</strong>
                    <span>Smart monitoring</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="features">
            <div className="section-heading">
              <span>HOW IT WORKS</span>
              <h2>From Leaf Photo to Action</h2>
            </div>

            <div className="feature-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <Camera />
                </div>
                <h3>1. Capture</h3>
                <p>
                  Take a clear photo of the affected crop leaf.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                  <Activity />
                </div>
                <h3>2. Analyze</h3>
                <p>
                  AI examines the actual uploaded image for visible symptoms.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                  <Sprout />
                </div>
                <h3>3. Protect</h3>
                <p>
                  Get practical actions and prevention guidance.
                </p>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* SCANNER */}
      {page === "scanner" && (
        <main className="page-container">
          <div className="page-heading">
            <span>AI CROP SCANNER</span>
            <h1>Check Your Crop Health</h1>
            <p>
              Upload a clear image of a crop leaf for AI-powered visual
              analysis.
            </p>
          </div>

          {!image ? (
            <div className="upload-card">
              <div className="upload-icon">
                <Upload size={42} />
              </div>

              <h2>Upload Crop Image</h2>

              <p>
                JPG, JPEG or PNG • Clear leaf images work best
              </p>

              <label className="upload-button">
                <Camera size={20} />
                Choose Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                  hidden
                />
              </label>
            </div>
          ) : (
            <div className="scanner-preview">
              <div className="preview-image">
                <img src={image} alt="Uploaded crop" />
              </div>

              <div className="preview-info">
                <div className="ready-badge">
                  <CheckCircle size={18} />
                  Image Ready
                </div>

                <h2>Ready for AI Analysis</h2>

                <p>
                  Our AI will inspect the actual image and provide a
                  preliminary crop-health assessment.
                </p>

                <button
                  className="primary-button full-button"
                  onClick={analyzeCrop}
                >
                  <Activity size={20} />
                  Analyze With AI
                  <ArrowRight size={18} />
                </button>

                <button
                  className="reset-button"
                  onClick={resetScanner}
                >
                  <RotateCcw size={18} />
                  Choose Another Image
                </button>
              </div>
            </div>
          )}
        </main>
      )}

      {/* RESULT */}
      {page === "result" && (
        <main className="page-container">
          <div className="page-heading">
            <span>AI ANALYSIS</span>
            <h1>Crop Health Report</h1>
            <p>
              Preliminary visual assessment based on the uploaded image.
            </p>
          </div>

          {loading && (
            <div className="loading-card">
              <div className="loading-spinner"></div>

              <h2>Analyzing Your Crop...</h2>

              <p>
                KrishiRakshak AI is examining the uploaded image.
              </p>
            </div>
          )}

          {!loading && result?.error && (
            <div className="error-card">
              <AlertTriangle size={40} />

              <h2>Analysis Failed</h2>

              <p>{result.error}</p>

              <button
                className="primary-button"
                onClick={resetScanner}
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && result && !result.error && (
            <div className="result-wrapper">
              <div className="result-top">
                {image && (
                  <div className="result-image">
                    <img src={image} alt="Analyzed crop" />
                  </div>
                )}

                <div className="diagnosis-card">
                  <div className="result-label">
                    DETECTED CROP
                  </div>

                  <h2>{result.crop}</h2>

                  <div className="disease-name">
                    {result.disease}
                  </div>

                  <div className="result-metrics">
                    <div>
                      <span>Confidence</span>
                      <strong>{result.confidence}</strong>
                    </div>

                    <div>
                      <span>Severity</span>
                      <strong>{result.severity}</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="result-grid">
                <div className="result-section">
                  <div className="result-section-title">
                    <AlertTriangle size={21} />
                    Visible Symptoms
                  </div>

                  <ul>
                    {result.symptoms?.map((symptom, index) => (
                      <li key={index}>
                        <CheckCircle size={17} />
                        {symptom}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="result-section">
                  <div className="result-section-title">
                    <ShieldCheck size={21} />
                    Recommended Actions
                  </div>

                  <ul>
                    {result.recommendation?.map((item, index) => (
                      <li key={index}>
                        <CheckCircle size={17} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="prevention-card">
                <div className="result-section-title">
                  <Sprout size={21} />
                  Prevention
                </div>

                <p>{result.prevention}</p>
              </div>

              <div className="disclaimer">
                <AlertTriangle size={20} />

                <p>
                  This is a preliminary AI-based visual assessment,
                  not a laboratory diagnosis. For serious crop damage,
                  confirm the condition with a local agricultural expert.
                </p>
              </div>

              <button
                className="primary-button"
                onClick={resetScanner}
              >
                <RotateCcw size={18} />
                Scan Another Crop
              </button>
            </div>
          )}
        </main>
      )}

      {/* WEATHER */}
      {page === "weather" && (
        <main className="page-container">
          <div className="page-heading">
            <span>WEATHER RISK</span>
            <h1>Smart Weather Monitoring</h1>
            <p>
              Weather conditions can influence crop disease development.
            </p>
          </div>

          <div className="weather-card">
            <div className="weather-main">
              <CloudSun size={70} />

              <div>
                <span>DEMO WEATHER DASHBOARD</span>
                <h2>Crop Risk Monitor</h2>
              </div>
            </div>

            <div className="weather-grid">
              <div>
                <ThermometerSun />
                <span>Temperature</span>
                <strong>28°C</strong>
              </div>

              <div>
                <Droplets />
                <span>Humidity</span>
                <strong>72%</strong>
              </div>

              <div>
                <Wind />
                <span>Wind</span>
                <strong>12 km/h</strong>
              </div>

              <div>
                <Activity />
                <span>Disease Risk</span>
                <strong>Moderate</strong>
              </div>
            </div>

            <div className="weather-note">
              <ShieldCheck size={20} />

              <p>
                Weather risk is shown as a prototype feature for the
                hackathon. A production version can connect to a live
                weather API and generate location-specific crop risk alerts.
              </p>
            </div>
          </div>
        </main>
      )}

      {/* FOOTER */}
      <footer>
        <div>
          <Leaf size={20} />
          <strong>KrishiRakshak AI</strong>
        </div>

        <span>
          Smart technology for healthier crops and better farming.
        </span>
      </footer>
    </div>
  );
}

export default App;