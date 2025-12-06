import PageTitle from "@/components/darkone/layout/PageTitle";

const IconsBoxicons = () => {
  const icons = [
    'bx-home', 'bx-user', 'bx-cog', 'bx-envelope', 'bx-bell', 'bx-search',
    'bx-heart', 'bx-star', 'bx-cart', 'bx-menu', 'bx-plus', 'bx-minus',
    'bx-check', 'bx-x', 'bx-edit', 'bx-trash', 'bx-download', 'bx-upload',
    'bx-calendar', 'bx-time', 'bx-map', 'bx-phone', 'bx-camera', 'bx-image',
    'bx-file', 'bx-folder', 'bx-cloud', 'bx-lock', 'bx-key', 'bx-shield',
    'bx-info-circle', 'bx-question-circle', 'bx-check-circle', 'bx-x-circle',
    'bx-chevron-left', 'bx-chevron-right', 'bx-chevron-up', 'bx-chevron-down',
    'bx-arrow-back', 'bx-refresh', 'bx-share', 'bx-bookmark', 'bx-flag', 'bx-link'
  ];

  return (
    <>
      <PageTitle title="Boxicons" subTitle="Icons" />

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title mb-0">Boxicons Library</h4>
              <p className="text-muted mb-0">Over 1500+ icons available</p>
            </div>
            <div className="card-body">
              <div className="row g-3">
                {icons.map((icon) => (
                  <div key={icon} className="col-xl-2 col-lg-3 col-md-4 col-6">
                    <div className="border rounded p-3 text-center">
                      <i className={`bx ${icon} fs-24`}></i>
                      <p className="text-muted mb-0 mt-2 small text-truncate">{icon}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center mt-4">
                <a 
                  href="https://boxicons.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-outline-primary"
                >
                  View All Icons
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default IconsBoxicons;
