import PageTitle from "@/components/darkone/layout/PageTitle";

const UICarousel = () => {
  return (
    <>
      <PageTitle title="Carousel" subTitle="Base UI" />
      <div className="row">
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header"><h4 className="card-title mb-0">Basic Carousel</h4></div>
            <div className="card-body">
              <div id="carousel1" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-inner rounded">
                  <div className="carousel-item active">
                    <div className="bg-primary d-flex align-items-center justify-content-center" style={{height: '250px'}}>
                      <h3 className="text-white">Slide 1</h3>
                    </div>
                  </div>
                  <div className="carousel-item">
                    <div className="bg-success d-flex align-items-center justify-content-center" style={{height: '250px'}}>
                      <h3 className="text-white">Slide 2</h3>
                    </div>
                  </div>
                  <div className="carousel-item">
                    <div className="bg-info d-flex align-items-center justify-content-center" style={{height: '250px'}}>
                      <h3 className="text-white">Slide 3</h3>
                    </div>
                  </div>
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carousel1" data-bs-slide="prev">
                  <span className="carousel-control-prev-icon"></span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carousel1" data-bs-slide="next">
                  <span className="carousel-control-next-icon"></span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header"><h4 className="card-title mb-0">With Indicators</h4></div>
            <div className="card-body">
              <div id="carousel2" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-indicators">
                  <button type="button" data-bs-target="#carousel2" data-bs-slide-to="0" className="active"></button>
                  <button type="button" data-bs-target="#carousel2" data-bs-slide-to="1"></button>
                  <button type="button" data-bs-target="#carousel2" data-bs-slide-to="2"></button>
                </div>
                <div className="carousel-inner rounded">
                  <div className="carousel-item active">
                    <div className="bg-warning d-flex align-items-center justify-content-center" style={{height: '250px'}}>
                      <h3 className="text-white">First Slide</h3>
                    </div>
                  </div>
                  <div className="carousel-item">
                    <div className="bg-danger d-flex align-items-center justify-content-center" style={{height: '250px'}}>
                      <h3 className="text-white">Second Slide</h3>
                    </div>
                  </div>
                  <div className="carousel-item">
                    <div className="bg-dark d-flex align-items-center justify-content-center" style={{height: '250px'}}>
                      <h3 className="text-white">Third Slide</h3>
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

export default UICarousel;
