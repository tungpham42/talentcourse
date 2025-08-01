import MainBrandLogo from "./components/MainBrandLogo";
import ModulesPage from "./pages/Modules";

function App() {
  return (
    <>
      <MainBrandLogo
        logoSrc="/soft-logo.webp"
        mainDomain="soft.io.vn"
        dismissible={false}
        altText="Logo Soft"
      />
      <ModulesPage />
    </>
  );
}

export default App;
