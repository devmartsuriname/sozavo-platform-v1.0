import PageTitle from "@/components/darkone/layout/PageTitle";

const UIScrollspy = () => {
  return (
    <>
      <PageTitle title="Scrollspy" subTitle="Base UI" />
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header"><h4 className="card-title mb-0">Scrollspy Example</h4></div>
            <div className="card-body">
              <nav id="navbar-example2" className="navbar navbar-light bg-light px-3 mb-3">
                <a className="navbar-brand" href="#">Navbar</a>
                <ul className="nav nav-pills">
                  <li className="nav-item">
                    <a className="nav-link" href="#scrollspyHeading1">First</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#scrollspyHeading2">Second</a>
                  </li>
                  <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#">Dropdown</a>
                    <ul className="dropdown-menu">
                      <li><a className="dropdown-item" href="#scrollspyHeading3">Third</a></li>
                      <li><a className="dropdown-item" href="#scrollspyHeading4">Fourth</a></li>
                    </ul>
                  </li>
                </ul>
              </nav>
              <div data-bs-spy="scroll" data-bs-target="#navbar-example2" data-bs-offset="0" className="scrollspy-example p-3 rounded" style={{position: 'relative', height: '200px', overflow: 'auto', backgroundColor: 'rgba(0,0,0,.03)'}}>
                <h4 id="scrollspyHeading1">First heading</h4>
                <p>This is some placeholder content for the scrollspy page.</p>
                <h4 id="scrollspyHeading2">Second heading</h4>
                <p>This is some placeholder content for the scrollspy page.</p>
                <h4 id="scrollspyHeading3">Third heading</h4>
                <p>This is some placeholder content for the scrollspy page.</p>
                <h4 id="scrollspyHeading4">Fourth heading</h4>
                <p>This is some placeholder content for the scrollspy page.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UIScrollspy;
