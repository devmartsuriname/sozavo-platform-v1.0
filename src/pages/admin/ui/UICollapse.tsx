import PageTitle from "@/components/darkone/layout/PageTitle";
import { useState } from "react";

const UICollapse = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <PageTitle title="Collapse" subTitle="Base UI" />
      <div className="row">
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header"><h4 className="card-title mb-0">Basic Collapse</h4></div>
            <div className="card-body">
              <button 
                className="btn btn-primary mb-3" 
                onClick={() => setOpen(!open)}
              >
                Toggle Collapse
              </button>
              <div className={`collapse ${open ? 'show' : ''}`}>
                <div className="card card-body mb-0">
                  This is some placeholder content for the collapse component. 
                  It can contain any content you want.
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header"><h4 className="card-title mb-0">Multiple Targets</h4></div>
            <div className="card-body">
              <p className="text-muted">
                Multiple collapse elements can be controlled with buttons. 
                This is useful for creating expandable sections.
              </p>
              <div className="d-flex gap-2">
                <button className="btn btn-outline-primary">Toggle First</button>
                <button className="btn btn-outline-secondary">Toggle Second</button>
                <button className="btn btn-outline-success">Toggle Both</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UICollapse;
