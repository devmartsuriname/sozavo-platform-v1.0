import PageTitle from "@/components/darkone/layout/PageTitle";

const UIBadge = () => {
  return (
    <>
      <PageTitle title="Badge" subTitle="Base UI" />
      <div className="row">
        <div className="col-xl-6">
          <div className="card">
            <div className="card-header"><h4 className="card-title mb-0">Default Badges</h4></div>
            <div className="card-body d-flex gap-2 flex-wrap">
              <span className="badge bg-primary">Primary</span>
              <span className="badge bg-secondary">Secondary</span>
              <span className="badge bg-success">Success</span>
              <span className="badge bg-danger">Danger</span>
              <span className="badge bg-warning">Warning</span>
              <span className="badge bg-info">Info</span>
              <span className="badge bg-dark">Dark</span>
            </div>
          </div>
        </div>
        <div className="col-xl-6">
          <div className="card">
            <div className="card-header"><h4 className="card-title mb-0">Soft Badges</h4></div>
            <div className="card-body d-flex gap-2 flex-wrap">
              <span className="badge badge-soft-primary">Primary</span>
              <span className="badge badge-soft-secondary">Secondary</span>
              <span className="badge badge-soft-success">Success</span>
              <span className="badge badge-soft-danger">Danger</span>
              <span className="badge badge-soft-warning">Warning</span>
              <span className="badge badge-soft-info">Info</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UIBadge;
