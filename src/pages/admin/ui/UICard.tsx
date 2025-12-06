import PageTitle from "@/components/darkone/layout/PageTitle";

const UICard = () => {
  return (
    <>
      <PageTitle title="Cards" subTitle="Base UI" />
      <div className="row">
        <div className="col-lg-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Card title</h5>
              <p className="card-text">Some quick example text to build on the card title.</p>
              <a href="#" className="btn btn-primary">Go somewhere</a>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">Featured</div>
            <div className="card-body">
              <h5 className="card-title">Special title</h5>
              <p className="card-text">With header and footer support.</p>
              <a href="#" className="btn btn-primary">Go somewhere</a>
            </div>
            <div className="card-footer text-muted">2 days ago</div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card text-center">
            <div className="card-header">Quote</div>
            <div className="card-body">
              <blockquote className="blockquote mb-0">
                <p>A well-known quote, contained in a blockquote element.</p>
                <footer className="blockquote-footer">Someone famous</footer>
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UICard;
