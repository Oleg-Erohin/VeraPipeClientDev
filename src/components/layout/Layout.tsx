import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import BaseMaterialCertificateEditor from "../BaseMaterialCertificateEditor/BaseMaterialCertificateEditor.1";
import BaseMaterialCertificatesList from "../BaseMaterialCertificatesList/BaseMaterialCertificatesList";

function Layout() {
  // const navigate = useNavigate();

  // useEffect(() => {
  //     navigate('/');
  //   }, []);

  return (
    <div>
      <Routes>
        <Route path="/" element={<BaseMaterialCertificatesList />} />

        {/* <Route path = '/base_material_certificates' element = {<BaseMaterialCertificatesList/>}/> */}
        {/* <Route path = '/base_material_certificate_editor' element = {<BaseMaterialCertificateEditor/>}/> */}
      </Routes>
    </div>
  );
}

export default Layout;
