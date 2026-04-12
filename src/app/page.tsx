import Image from "next/image";
import NavBar from "../components/core/NavBar";
import HeroSection from "../components/home/Hero";
import HeritageSection from "../components/home/Heritage";
import LocationSection from "../components/home/Location";
import Footer from "../components/core/Footer";
import LoginPage from "../components/authentication/LogIn";
import AddStaffModal from "../components/authentication/AddStaff";

export default function Home() {
  return (
    <main className="min-h-100vh">
      <NavBar />
      <HeroSection />
      <HeritageSection />
      <LocationSection />
      {/* <LoginPage /> */}
      {/* <AddStaffModal /> */}
      <Footer />
    </main>
  );
}
