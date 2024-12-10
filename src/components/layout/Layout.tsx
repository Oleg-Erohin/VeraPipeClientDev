import { Route, Routes } from "react-router-dom";
import BaseMaterialCertificatesList from "../BaseMaterialCertificate/BaseMaterialCertificatesList/BaseMaterialCertificatesList";
import NavigationMenu from "../NavigationMenu/NavigationMenu";

function Layout() {

  return (
    <div>
      <header>
        <NavigationMenu />
      </header>
      <main>
        <div>
          <Routes>
            <Route path='/base_material_certificates' element={<BaseMaterialCertificatesList />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default Layout;
