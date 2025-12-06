import PageTitle from "@/components/darkone/layout/PageTitle";

const MapsGoogle = () => {
  return (
    <>
      <PageTitle title="Google Maps" subTitle="Maps" />

      <div className="row">
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title mb-0">Basic Map</h4>
            </div>
            <div className="card-body">
              <div 
                className="rounded d-flex align-items-center justify-content-center" 
                style={{ 
                  height: '300px', 
                  backgroundColor: '#e8e8e8',
                  backgroundImage: 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)',
                  backgroundSize: '20px 20px',
                  backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                }}
              >
                <div className="text-center">
                  <i className="bx bx-map fs-48 text-muted"></i>
                  <p className="text-muted mb-0">Google Maps Placeholder</p>
                  <small className="text-muted">Requires API key integration</small>
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
                  backgroundColor: '#e8e8e8',
                  backgroundImage: 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)',
                  backgroundSize: '20px 20px',
                  backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                }}
              >
                <div className="text-center">
                  <i className="bx bx-map-pin fs-48 text-muted"></i>
                  <p className="text-muted mb-0">Map with Markers Placeholder</p>
                  <small className="text-muted">Requires API key integration</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title mb-0">Full Width Map</h4>
            </div>
            <div className="card-body">
              <div 
                className="rounded d-flex align-items-center justify-content-center" 
                style={{ 
                  height: '400px', 
                  backgroundColor: '#e8e8e8',
                  backgroundImage: 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)',
                  backgroundSize: '20px 20px',
                  backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                }}
              >
                <div className="text-center">
                  <i className="bx bx-world fs-48 text-muted"></i>
                  <p className="text-muted mb-0">Full Width Map Placeholder</p>
                  <small className="text-muted">To enable: Add Google Maps API key</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MapsGoogle;
