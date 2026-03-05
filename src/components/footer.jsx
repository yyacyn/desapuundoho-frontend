import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaInstagram, FaYoutube, FaFacebook, FaTwitter } from 'react-icons/fa';

function Footer({ siteSettings }) {
  const {
    instansi_name = 'Desa Puundoho',
    instansi_description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod temporLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor',
    instansi_address = 'Kecamatan Baula, Kabupaten Kolaka, Sulawesi Tenggara',
    instansi_phone = '+62812-3456-7890',
    instansi_email = 'loremipsum@gmail.com',
    logo = './assets/logo-puundoho.png',
    instagram = '#',
    youtube = '#',
    facebook = '#',
    twitter = '#',
    web_theme = 0,
  } = siteSettings || {};

  // Footer ornament based on web_theme
  const getFooterOrnament = () => {
    const ornaments = {
      1: 'ornament/ramadhan/footer.svg',
      2: 'ornament/natal/footer.svg',
      3: 'ornament/waisak/footer.svg',
      4: 'ornament/nyepi/footer.svg',
      5: 'ornament/imlek/footer.svg',
    };
    return ornaments[web_theme] || null;
  };

  const footerOrnament = getFooterOrnament();

  return (
    <footer className="bg-[#298064] text-white py-12 px-4 lg:px-12">
      <div className="container mx-auto px-4">
        {/* Top Card Section */}
        <div className="bg-[#00321F] w-full lg:w-[90%] h-auto lg:h-60 mx-auto rounded-4xl flex flex-col lg:flex-row justify-center items-center mb-10 relative py-8 lg:py-0">
          {/* Logo Circle */}
          <div className="lg:absolute relative lg:-top-10 -top-5 w-30 h-30 rounded-full bg-white z-10 justify-center items-center flex shadow-2xl">
            <img src={logo} alt="" className="w-20 h-20" />
          </div>

          {/* Footer Ornament */}
          {footerOrnament && (
            <img
              src={footerOrnament}
              className="absolute -right-10 lg:top-30 lg:w-40 lg:h-40 top-80 w-30 h-20"
              alt="footer-ornament"
            />
          )}

          {/* Contact Info Cards */}
          <div className="bg-white lg:absolute relative w-[90%] lg:w-[110%] h-auto rounded-4xl flex flex-col lg:flex-row items-center lg:items-start justify-between px-6 lg:px-10 py-8 lg:py-15 gap-6 lg:gap-6 overflow-hidden">
            {/* Address */}
            <div className="flex items-start gap-3 lg:gap-4 w-full lg:flex-1">
              <div className="flex-1 text-center">
                <div className="text-black text-sm lg:text-base mb-1 font-semibold">Kantor Desa Puundoho</div>
                <div className="text-[#298064] font-medium text-xs lg:text-sm break-words leading-relaxed">
                  {instansi_address}
                </div>
              </div>
            </div>

            {/* Divider (Desktop Only) */}
            <div className="hidden lg:block w-px h-16 bg-gray-200"></div>

            {/* Phone */}
            <div className="flex items-start gap-3 lg:gap-4 w-full lg:flex-1">
              <div className="flex-1 text-center">
                <div className="text-black text-sm lg:text-base mb-1 font-semibold">Hubungi Kami di</div>
                <div className="text-[#298064] font-medium text-xs lg:text-sm break-words leading-relaxed">
                  {instansi_phone}
                </div>
              </div>
            </div>

            {/* Divider (Desktop Only) */}
            <div className="hidden lg:block w-px h-16 bg-gray-200"></div>

            {/* Email */}
            <div className="flex items-start gap-3 lg:gap-4 w-full lg:flex-1">
              <div className="flex-1 text-center">
                <div className="text-black text-sm lg:text-base mb-1 font-semibold">Email Kami</div>
                <div className="text-[#298064] font-medium text-xs lg:text-sm break-words leading-relaxed">
                  {instansi_email}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 mb-8">
          {/* Description */}
          <div className="md:col-span-2">
            <h3 className="text-lg md:text-xl font-bold mb-4">{instansi_name}</h3>
            <p className="text-sm md:text-base mb-4 leading-relaxed text-gray-100">
              {instansi_description}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-bold mb-4 text-base md:text-lg">Navigasi</h4>
            <ul className="space-y-2 text-sm md:text-base">
              <li><a href="#" className="hover:text-emerald-200 transition-colors">Profil</a></li>
              <li><a href="/berita" className="hover:text-emerald-200 transition-colors">Infografis</a></li>
              <li><a href="/e-survey" className="hover:text-emerald-200 transition-colors">IDM</a></li>
            </ul>
          </div>

          {/* Profile */}
          <div>
            <h4 className="font-bold mb-4 text-base md:text-lg">Navigasi</h4>
            <ul className="space-y-2 text-sm md:text-base">
              <li><a href="/belanja" className="hover:text-emerald-200 transition-colors">Belanja</a></li>
              <li><a href="/berita" className="hover:text-emerald-200 transition-colors">Berita</a></li>
              <li><a href="/galeri" className="hover:text-emerald-200 transition-colors">Galeri</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 lg:gap-8">
            <div className="text-center text-sm md:text-base">
              © Copyright 2026 Pendekar Batam All Rights Reserved
            </div>

            {/* Social Media Icons */}
            <div className="flex gap-4 md:gap-5 mr-10">
              <a href={instagram} className="hover:text-emerald-200 transition-colors">
                <FaInstagram className="text-2xl md:text-3xl" />
              </a>
              <a href={youtube} className="hover:text-emerald-200 transition-colors">
                <FaYoutube className="text-2xl md:text-3xl" />
              </a>
              <a href={facebook} className="hover:text-emerald-200 transition-colors">
                <FaFacebook className="text-2xl md:text-3xl" />
              </a>
              <a href={twitter} className="hover:text-emerald-200 transition-colors">
                <FaTwitter className="text-2xl md:text-3xl" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}

export default Footer;
