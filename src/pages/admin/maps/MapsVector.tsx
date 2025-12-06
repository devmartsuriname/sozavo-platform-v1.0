import PageTitle from "@/components/darkone/layout/PageTitle";

const MapsVector = () => {
  return (
    <>
      <PageTitle title="Vector Maps" subTitle="Maps" />

      <div className="row">
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title mb-0">World Map</h4>
            </div>
            <div className="card-body">
              <div 
                className="rounded d-flex align-items-center justify-content-center" 
                style={{ 
                  height: '300px', 
                  backgroundColor: 'rgba(169, 183, 197, 0.1)',
                  border: '1px dashed #ccc'
                }}
              >
                <div className="text-center">
                  <i className="bx bx-globe fs-48 text-primary"></i>
                  <p className="text-muted mb-0 mt-2">World Vector Map</p>
                  <small className="text-muted">jsVectorMap placeholder</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title mb-0">USA Map</h4>
            </div>
            <div className="card-body">
              <div 
                className="rounded d-flex align-items-center justify-content-center" 
                style={{ 
                  height: '300px', 
                  backgroundColor: 'rgba(169, 183, 197, 0.1)',
                  border: '1px dashed #ccc'
                }}
              >
                <div className="text-center">
                  <i className="bx bx-map-alt fs-48 text-primary"></i>
                  <p className="text-muted mb-0 mt-2">USA Vector Map</p>
                  <small className="text-muted">jsVectorMap placeholder</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title mb-0">Canada Map</h4>
            </div>
            <div className="card-body">
              <div 
                className="rounded d-flex align-items-center justify-content-center" 
                style={{ 
                  height: '300px', 
                  backgroundColor: 'rgba(169, 183, 197, 0.1)',
                  border: '1px dashed #ccc'
                }}
              >
                <div className="text-center">
                  <i className="bx bx-map-alt fs-48 text-primary"></i>
                  <p className="text-muted mb-0 mt-2">Canada Vector Map</p>
                  <small className="text-muted">jsVectorMap placeholder</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title mb-0">Map with Markers</h4>
            </div>
            <div className="card-body">
              <div 
                className="rounded d-flex align-items-center justify-content-center" 
                style={{ 
                  height: '300px', 
                  backgroundColor: 'rgba(169, 183, 197, 0.1)',
                  border: '1px dashed #ccc'
                }}
              >
                <div className="text-center">
                  <i className="bx bx-map-pin fs-48 text-primary"></i>
                  <p className="text-muted mb-0 mt-2">Map with Custom Markers</p>
                  <small className="text-muted">jsVectorMap placeholder</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MapsVector;
