import PageTitle from "@/components/darkone/layout/PageTitle";
import Icon from "@/components/darkone/ui/Icon";

const IconsSolar = () => {
  const icons = [
    'solar:home-2-bold', 'solar:user-bold', 'solar:settings-bold',
    'solar:letter-bold', 'solar:bell-bold', 'solar:magnifer-bold',
    'solar:heart-bold', 'solar:star-bold', 'solar:cart-bold',
    'solar:hamburger-menu-bold', 'solar:add-circle-bold', 'solar:minus-circle-bold',
    'solar:check-circle-bold', 'solar:close-circle-bold', 'solar:pen-bold',
    'solar:trash-bin-2-bold', 'solar:download-bold', 'solar:upload-bold',
    'solar:calendar-bold', 'solar:clock-circle-bold', 'solar:map-point-bold',
    'solar:phone-bold', 'solar:camera-bold', 'solar:gallery-bold',
    'solar:document-bold', 'solar:folder-bold', 'solar:cloud-bold',
    'solar:lock-bold', 'solar:key-bold', 'solar:shield-bold',
    'solar:info-circle-bold', 'solar:question-circle-bold',
    'solar:alt-arrow-left-bold', 'solar:alt-arrow-right-bold',
    'solar:alt-arrow-up-bold', 'solar:alt-arrow-down-bold'
  ];

  return (
    <>
      <PageTitle title="Solar Icons" subTitle="Icons" />

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title mb-0">Solar Icons Library</h4>
              <p className="text-muted mb-0">Beautiful duotone icons</p>
            </div>
            <div className="card-body">
              <div className="row g-3">
                {icons.map((icon) => (
                  <div key={icon} className="col-xl-2 col-lg-3 col-md-4 col-6">
                    <div className="border rounded p-3 text-center">
                      <Icon icon={icon} className="fs-24" />
                      <p className="text-muted mb-0 mt-2 small text-truncate">{icon.split(':')[1]}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center mt-4">
                <a 
                  href="https://icones.js.org/collection/solar" 
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

export default IconsSolar;
