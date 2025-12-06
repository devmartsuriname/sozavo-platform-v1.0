import PageTitle from "@/components/darkone/layout/PageTitle";

const UIButtons = () => {
  return (
    <>
      <PageTitle title="Buttons" subTitle="Base UI" />
      <div className="row">
        <div className="col-xl-6">
          <div className="card">
            <div className="card-header"><h4 className="card-title mb-0">Default Buttons</h4></div>
            <div className="card-body d-flex gap-2 flex-wrap">
              <button className="btn btn-primary">Primary</button>
              <button className="btn btn-secondary">Secondary</button>
              <button className="btn btn-success">Success</button>
              <button className="btn btn-danger">Danger</button>
              <button className="btn btn-warning">Warning</button>
              <button className="btn btn-info">Info</button>
              <button className="btn btn-dark">Dark</button>
            </div>
          </div>
        </div>
        <div className="col-xl-6">
          <div className="card">
            <div className="card-header"><h4 className="card-title mb-0">Outline Buttons</h4></div>
            <div className="card-body d-flex gap-2 flex-wrap">
              <button className="btn btn-outline-primary">Primary</button>
              <button className="btn btn-outline-secondary">Secondary</button>
              <button className="btn btn-outline-success">Success</button>
              <button className="btn btn-outline-danger">Danger</button>
              <button className="btn btn-outline-warning">Warning</button>
              <button className="btn btn-outline-info">Info</button>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-xl-6">
          <div className="card">
            <div className="card-header"><h4 className="card-title mb-0">Button Sizes</h4></div>
            <div className="card-body d-flex gap-2 align-items-center flex-wrap">
              <button className="btn btn-primary btn-lg">Large</button>
              <button className="btn btn-primary">Default</button>
              <button className="btn btn-primary btn-sm">Small</button>
            </div>
          </div>
        </div>
        <div className="col-xl-6">
          <div className="card">
            <div className="card-header"><h4 className="card-title mb-0">Button States</h4></div>
            <div className="card-body d-flex gap-2 flex-wrap">
              <button className="btn btn-primary">Normal</button>
              <button className="btn btn-primary active">Active</button>
              <button className="btn btn-primary" disabled>Disabled</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UIButtons;
