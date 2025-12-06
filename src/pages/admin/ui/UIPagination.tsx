import PageTitle from "@/components/darkone/layout/PageTitle";

const UIPagination = () => {
  return (
    <>
      <PageTitle title="Pagination" subTitle="Base UI" />
      <div className="row">
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header"><h4 className="card-title mb-0">Basic Pagination</h4></div>
            <div className="card-body">
              <nav>
                <ul className="pagination">
                  <li className="page-item"><a className="page-link" href="#">Previous</a></li>
                  <li className="page-item"><a className="page-link" href="#">1</a></li>
                  <li className="page-item active"><a className="page-link" href="#">2</a></li>
                  <li className="page-item"><a className="page-link" href="#">3</a></li>
                  <li className="page-item"><a className="page-link" href="#">Next</a></li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header"><h4 className="card-title mb-0">Pagination Sizes</h4></div>
            <div className="card-body">
              <nav>
                <ul className="pagination pagination-lg mb-3">
                  <li className="page-item active"><a className="page-link" href="#">1</a></li>
                  <li className="page-item"><a className="page-link" href="#">2</a></li>
                  <li className="page-item"><a className="page-link" href="#">3</a></li>
                </ul>
              </nav>
              <nav>
                <ul className="pagination pagination-sm mb-0">
                  <li className="page-item active"><a className="page-link" href="#">1</a></li>
                  <li className="page-item"><a className="page-link" href="#">2</a></li>
                  <li className="page-item"><a className="page-link" href="#">3</a></li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UIPagination;
