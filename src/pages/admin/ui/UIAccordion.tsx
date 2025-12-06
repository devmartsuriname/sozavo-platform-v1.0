import { useState } from "react";
import PageTitle from "@/components/darkone/layout/PageTitle";

const UIAccordion = () => {
  const [openAccordion, setOpenAccordion] = useState<string | null>("collapseOne");
  const [openFlush, setOpenFlush] = useState<string | null>(null);
  const [openStayOpen, setOpenStayOpen] = useState<string[]>(["panelsStayOpen-collapseOne"]);

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  const toggleFlush = (id: string) => {
    setOpenFlush(openFlush === id ? null : id);
  };

  const toggleStayOpen = (id: string) => {
    if (openStayOpen.includes(id)) {
      setOpenStayOpen(openStayOpen.filter(item => item !== id));
    } else {
      setOpenStayOpen([...openStayOpen, id]);
    }
  };

  return (
    <>
      <PageTitle title="Base UI" subTitle="Accordion" />

      <div className="row">
        {/* Basic Example */}
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Basic Example</h5>
              <p className="card-subtitle">Using the card component, you can extend the default collapse behavior to create an accordion. To properly achieve the accordion style, be sure to use <code>.accordion</code> as a wrapper.</p>
            </div>
            <div className="card-body">
              <div className="accordion" id="accordionExample">
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingOne">
                    <button 
                      className={`accordion-button fw-medium ${openAccordion !== "collapseOne" ? "collapsed" : ""}`}
                      type="button"
                      onClick={() => toggleAccordion("collapseOne")}
                    >
                      Accordion Item #1
                    </button>
                  </h2>
                  <div 
                    id="collapseOne" 
                    className={`accordion-collapse collapse ${openAccordion === "collapseOne" ? "show" : ""}`}
                  >
                    <div className="accordion-body">
                      <strong>This is the first item's accordion body.</strong> It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables.
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingTwo">
                    <button 
                      className={`accordion-button fw-medium ${openAccordion !== "collapseTwo" ? "collapsed" : ""}`}
                      type="button"
                      onClick={() => toggleAccordion("collapseTwo")}
                    >
                      Accordion Item #2
                    </button>
                  </h2>
                  <div 
                    id="collapseTwo" 
                    className={`accordion-collapse collapse ${openAccordion === "collapseTwo" ? "show" : ""}`}
                  >
                    <div className="accordion-body">
                      <strong>This is the second item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions.
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingThree">
                    <button 
                      className={`accordion-button fw-medium ${openAccordion !== "collapseThree" ? "collapsed" : ""}`}
                      type="button"
                      onClick={() => toggleAccordion("collapseThree")}
                    >
                      Accordion Item #3
                    </button>
                  </h2>
                  <div 
                    id="collapseThree" 
                    className={`accordion-collapse collapse ${openAccordion === "collapseThree" ? "show" : ""}`}
                  >
                    <div className="accordion-body">
                      <strong>This is the third item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Flush Accordion */}
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Flush Accordion</h5>
              <p className="card-subtitle">Add <code>.accordion-flush</code> to remove the default <code>background-color</code>, some borders, and some rounded corners to render accordions edge-to-edge with their parent container.</p>
            </div>
            <div className="card-body">
              <div className="accordion accordion-flush" id="accordionFlushExample">
                <div className="accordion-item">
                  <h2 className="accordion-header" id="flush-headingOne">
                    <button 
                      className={`accordion-button ${openFlush !== "flush-collapseOne" ? "collapsed" : ""}`}
                      type="button"
                      onClick={() => toggleFlush("flush-collapseOne")}
                    >
                      Accordion Item #1
                    </button>
                  </h2>
                  <div 
                    id="flush-collapseOne" 
                    className={`accordion-collapse collapse ${openFlush === "flush-collapseOne" ? "show" : ""}`}
                  >
                    <div className="accordion-body">
                      Placeholder content for this accordion, which is intended to demonstrate the <code>.accordion-flush</code> class. This is the first item's accordion body.
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="flush-headingTwo">
                    <button 
                      className={`accordion-button ${openFlush !== "flush-collapseTwo" ? "collapsed" : ""}`}
                      type="button"
                      onClick={() => toggleFlush("flush-collapseTwo")}
                    >
                      Accordion Item #2
                    </button>
                  </h2>
                  <div 
                    id="flush-collapseTwo" 
                    className={`accordion-collapse collapse ${openFlush === "flush-collapseTwo" ? "show" : ""}`}
                  >
                    <div className="accordion-body">
                      Placeholder content for this accordion, which is intended to demonstrate the <code>.accordion-flush</code> class. This is the second item's accordion body.
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="flush-headingThree">
                    <button 
                      className={`accordion-button ${openFlush !== "flush-collapseThree" ? "collapsed" : ""}`}
                      type="button"
                      onClick={() => toggleFlush("flush-collapseThree")}
                    >
                      Accordion Item #3
                    </button>
                  </h2>
                  <div 
                    id="flush-collapseThree" 
                    className={`accordion-collapse collapse ${openFlush === "flush-collapseThree" ? "show" : ""}`}
                  >
                    <div className="accordion-body">
                      Placeholder content for this accordion, which is intended to demonstrate the <code>.accordion-flush</code> class. This is the third item's accordion body.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Always Open Accordion */}
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Always Open Accordion</h5>
              <p className="card-subtitle">Omit the <code>data-bs-parent</code> attribute on each <code>.accordion-collapse</code> to make accordion items stay open when another item is opened.</p>
            </div>
            <div className="card-body">
              <div className="accordion" id="accordionPanelsStayOpenExample">
                <div className="accordion-item">
                  <h2 className="accordion-header" id="panelsStayOpen-headingOne">
                    <button 
                      className={`accordion-button ${!openStayOpen.includes("panelsStayOpen-collapseOne") ? "collapsed" : ""}`}
                      type="button"
                      onClick={() => toggleStayOpen("panelsStayOpen-collapseOne")}
                    >
                      Accordion Item #1
                    </button>
                  </h2>
                  <div 
                    id="panelsStayOpen-collapseOne" 
                    className={`accordion-collapse collapse ${openStayOpen.includes("panelsStayOpen-collapseOne") ? "show" : ""}`}
                  >
                    <div className="accordion-body">
                      <strong>This is the first item's accordion body.</strong> It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions.
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="panelsStayOpen-headingTwo">
                    <button 
                      className={`accordion-button ${!openStayOpen.includes("panelsStayOpen-collapseTwo") ? "collapsed" : ""}`}
                      type="button"
                      onClick={() => toggleStayOpen("panelsStayOpen-collapseTwo")}
                    >
                      Accordion Item #2
                    </button>
                  </h2>
                  <div 
                    id="panelsStayOpen-collapseTwo" 
                    className={`accordion-collapse collapse ${openStayOpen.includes("panelsStayOpen-collapseTwo") ? "show" : ""}`}
                  >
                    <div className="accordion-body">
                      <strong>This is the second item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element.
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="panelsStayOpen-headingThree">
                    <button 
                      className={`accordion-button ${!openStayOpen.includes("panelsStayOpen-collapseThree") ? "collapsed" : ""}`}
                      type="button"
                      onClick={() => toggleStayOpen("panelsStayOpen-collapseThree")}
                    >
                      Accordion Item #3
                    </button>
                  </h2>
                  <div 
                    id="panelsStayOpen-collapseThree" 
                    className={`accordion-collapse collapse ${openStayOpen.includes("panelsStayOpen-collapseThree") ? "show" : ""}`}
                  >
                    <div className="accordion-body">
                      <strong>This is the third item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UIAccordion;
