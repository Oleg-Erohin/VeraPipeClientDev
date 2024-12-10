import { useNavigate } from "react-router-dom";

function NavigationMenu() {

  let navigate = useNavigate();

  function handleNavigation(event: React.ChangeEvent<HTMLSelectElement>) {
    const value = event.target.value;
    if (value) {
      navigate(value);
    }
  }

  return (
    <div>
      <select onChange={handleNavigation} defaultValue="">
        <option value="" disabled hidden>Go to</option>
        <option value="/base_material_certificates">Base Material Certificates</option>
        <option value="/filler_material_certificates">Filler Material Certificates</option>
      </select>
    </div>
  );
}

export default NavigationMenu;