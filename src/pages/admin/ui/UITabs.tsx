import { useState } from "react";
import PageTitle from "@/components/darkone/layout/PageTitle";

const UITabs = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [activeTabJustified, setActiveTabJustified] = useState("profileTabsJustified");
  const [activePill, setActivePill] = useState("profilePill");
  const [activePillJustified, setActivePillJustified] = useState("profilePillJustified");

  return (
    <>
      <PageTitle title="Base UI" subTitle="Nav Tabs" />

      <div className="row">
        {/* Nav Tabs */}
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Nav Tabs</h5>
              <p className="card-subtitle">Use the <code>.nav-tabs</code> class to generate a tabbed interface.</p>
            </div>
            <div className="card-body">
              <ul className="nav nav-tabs">
                <li className="nav-item">
                  <a 
                    href="#home" 
                    className={`nav-link ${activeTab === "home" ? "active" : ""}`}
                    onClick={(e) => { e.preventDefault(); setActiveTab("home"); }}
                  >
                    <span className="d-none d-sm-block">Home</span>
                  </a>
                </li>
                <li className="nav-item">
                  <a 
                    href="#profile" 
                    className={`nav-link ${activeTab === "profile" ? "active" : ""}`}
                    onClick={(e) => { e.preventDefault(); setActiveTab("profile"); }}
                  >
                    <span className="d-none d-sm-block">Profile</span>
                  </a>
                </li>
                <li className="nav-item">
                  <a 
                    href="#messages" 
                    className={`nav-link ${activeTab === "messages" ? "active" : ""}`}
                    onClick={(e) => { e.preventDefault(); setActiveTab("messages"); }}
                  >
                    <span className="d-none d-sm-block">Messages</span>
                  </a>
                </li>
              </ul>
              <div className="tab-content text-muted">
                <div className={`tab-pane ${activeTab === "home" ? "active" : ""}`} id="home">
                  <p className="mb-0">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,
                    totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                    Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.</p>
                </div>
                <div className={`tab-pane ${activeTab === "profile" ? "active" : ""}`} id="profile">
                  <p className="mb-0">Li Europan lingues es membres del sam familie. Lor separat existentie es un myth. Por scientie, musica, sport etc,
                    litot Europa usa li sam vocabular. Li lingues differe solmen in li grammatica, li pronunciation e li plu commun vocabules.</p>
                </div>
                <div className={`tab-pane ${activeTab === "messages" ? "active" : ""}`} id="messages">
                  <p className="mb-0">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,
                    totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Justified */}
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Tabs Justified</h5>
              <p className="card-subtitle">Using class <code>.nav-justified</code>, you can force your tabs menu items to use the full available width.</p>
            </div>
            <div className="card-body">
              <ul className="nav nav-tabs nav-justified">
                <li className="nav-item">
                  <a 
                    href="#homeTabsJustified" 
                    className={`nav-link ${activeTabJustified === "homeTabsJustified" ? "active" : ""}`}
                    onClick={(e) => { e.preventDefault(); setActiveTabJustified("homeTabsJustified"); }}
                  >
                    <span className="d-none d-sm-block">Home</span>
                  </a>
                </li>
                <li className="nav-item">
                  <a 
                    href="#profileTabsJustified" 
                    className={`nav-link ${activeTabJustified === "profileTabsJustified" ? "active" : ""}`}
                    onClick={(e) => { e.preventDefault(); setActiveTabJustified("profileTabsJustified"); }}
                  >
                    <span className="d-none d-sm-block">Profile</span>
                  </a>
                </li>
                <li className="nav-item">
                  <a 
                    href="#messagesTabsJustified" 
                    className={`nav-link ${activeTabJustified === "messagesTabsJustified" ? "active" : ""}`}
                    onClick={(e) => { e.preventDefault(); setActiveTabJustified("messagesTabsJustified"); }}
                  >
                    <span className="d-none d-sm-block">Messages</span>
                  </a>
                </li>
              </ul>
              <div className="tab-content pt-2 text-muted">
                <div className={`tab-pane ${activeTabJustified === "homeTabsJustified" ? "active" : ""}`} id="homeTabsJustified">
                  <p className="mb-0">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,
                    totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
                </div>
                <div className={`tab-pane ${activeTabJustified === "profileTabsJustified" ? "active" : ""}`} id="profileTabsJustified">
                  <p className="mb-0">Li Europan lingues es membres del sam familie. Lor separat existentie es un myth. Por scientie, musica, sport etc,
                    litot Europa usa li sam vocabular.</p>
                </div>
                <div className={`tab-pane ${activeTabJustified === "messagesTabsJustified" ? "active" : ""}`} id="messagesTabsJustified">
                  <p className="mb-0">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,
                    totam rem aperiam.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Nav Pills */}
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Nav Pills</h5>
              <p className="card-subtitle">Use the <code>.nav-pills</code> class to generate a pilled interface.</p>
            </div>
            <div className="card-body">
              <ul className="nav nav-pills">
                <li className="nav-item">
                  <a 
                    href="#homePill" 
                    className={`nav-link ${activePill === "homePill" ? "active" : ""}`}
                    onClick={(e) => { e.preventDefault(); setActivePill("homePill"); }}
                  >
                    <span className="d-none d-sm-block">Home</span>
                  </a>
                </li>
                <li className="nav-item">
                  <a 
                    href="#profilePill" 
                    className={`nav-link ${activePill === "profilePill" ? "active" : ""}`}
                    onClick={(e) => { e.preventDefault(); setActivePill("profilePill"); }}
                  >
                    <span className="d-none d-sm-block">Profile</span>
                  </a>
                </li>
                <li className="nav-item">
                  <a 
                    href="#messagesPill" 
                    className={`nav-link ${activePill === "messagesPill" ? "active" : ""}`}
                    onClick={(e) => { e.preventDefault(); setActivePill("messagesPill"); }}
                  >
                    <span className="d-none d-sm-block">Messages</span>
                  </a>
                </li>
              </ul>
              <div className="tab-content pt-2 text-muted">
                <div className={`tab-pane ${activePill === "homePill" ? "active" : ""}`} id="homePill">
                  <p className="mb-0">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,
                    totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
                </div>
                <div className={`tab-pane ${activePill === "profilePill" ? "active" : ""}`} id="profilePill">
                  <p className="mb-0">Li Europan lingues es membres del sam familie. Lor separat existentie es un myth. Por scientie, musica, sport etc,
                    litot Europa usa li sam vocabular.</p>
                </div>
                <div className={`tab-pane ${activePill === "messagesPill" ? "active" : ""}`} id="messagesPill">
                  <p className="mb-0">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,
                    totam rem aperiam.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pills Justified */}
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Pills Justified</h5>
              <p className="card-subtitle">Using class <code>.nav-justified</code>, you can force your pills menu items to use the full available width.</p>
            </div>
            <div className="card-body">
              <div className="d-flex flex-wrap gap-2">
                <ul className="nav nav-pills nav-justified p-1">
                  <li className="nav-item">
                    <a 
                      href="#homePillJustified" 
                      className={`nav-link ${activePillJustified === "homePillJustified" ? "active" : ""}`}
                      onClick={(e) => { e.preventDefault(); setActivePillJustified("homePillJustified"); }}
                    >
                      <span className="d-none d-sm-block">Home</span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a 
                      href="#profilePillJustified" 
                      className={`nav-link ${activePillJustified === "profilePillJustified" ? "active" : ""}`}
                      onClick={(e) => { e.preventDefault(); setActivePillJustified("profilePillJustified"); }}
                    >
                      <span className="d-none d-sm-block">Profile</span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a 
                      href="#messagesPillJustified" 
                      className={`nav-link ${activePillJustified === "messagesPillJustified" ? "active" : ""}`}
                      onClick={(e) => { e.preventDefault(); setActivePillJustified("messagesPillJustified"); }}
                    >
                      <span className="d-none d-sm-block">Messages</span>
                    </a>
                  </li>
                </ul>
              </div>
              <div className="tab-content pt-2 text-muted">
                <div className={`tab-pane ${activePillJustified === "homePillJustified" ? "active" : ""}`} id="homePillJustified">
                  <p className="mb-0">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,
                    totam rem aperiam.</p>
                </div>
                <div className={`tab-pane ${activePillJustified === "profilePillJustified" ? "active" : ""}`} id="profilePillJustified">
                  <p className="mb-0">Li Europan lingues es membres del sam familie. Lor separat existentie es un myth.</p>
                </div>
                <div className={`tab-pane ${activePillJustified === "messagesPillJustified" ? "active" : ""}`} id="messagesPillJustified">
                  <p className="mb-0">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UITabs;
