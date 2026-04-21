import Navbar from "../components/navbar";
import Footer from "../components/footer";
import GaleriItem from "../components/galeriitem";

const galleryData = [
  {
    imageUrl: "./assets/galeri/galeri1.jpg",
    caption: "Sejarah awal Pembentukan nama 'sabara' di desa puundoho"
  },
  {
    imageUrl: "./assets/galeri/galeri1.jpg",
    caption: "Sejarah awal Pembentukan nama 'sabara' di desa puundoho"
  },
  {
    imageUrl: "./assets/galeri/galeri1.jpg",
    caption: "Sejarah awal Pembentukan nama 'sabara' di desa puundoho"
  },
  {
    imageUrl: "./assets/galeri/galeri1.jpg",
    caption: "Sejarah awal Pembentukan nama 'sabara' di desa puundoho"
  },
  {
    imageUrl: "./assets/galeri/galeri1.jpg",
    caption: "Sejarah awal Pembentukan nama 'sabara' di desa puundoho"
  },
  {
    imageUrl: "./assets/galeri/galeri1.jpg",
    caption: "Sejarah awal Pembentukan nama 'sabara' di desa puundoho"
  }
];

export default function GaleriPage() {
  return (
    <>
      <Navbar />
      <div className="pt-16">
        {/* HERO */}
        <section className="relative h-[320px] md:h-[530px] flex items-center justify-center text-white py-20">
          <img
            src="./assets/galeri/galeri-thumbnail.png"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative text-center">
            <h1 className="text-4xl md:text-5xl font-bold">Galeri</h1>
            <div className="w-32 h-1 bg-emerald-400 mx-auto mt-4 rounded-full"></div>
          </div>

        </section>


        {/* GALLERY */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {galleryData.map((item, index) => (
                <GaleriItem
                  key={index}
                  imageUrl={item.imageUrl}
                  altText="galeri"
                  caption={item.caption}
                />
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer siteSettings={undefined} />
    </>
  );
}