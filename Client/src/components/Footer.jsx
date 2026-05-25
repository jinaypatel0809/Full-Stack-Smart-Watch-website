const customerService = ["Payment Options", "Track Order", "Find a Store", "Encircle Program", "E Warranty Registration"];
const policies = ["Brand Protection", "Cancellation", "Shipping", "Warranty Policies"];
const about = ["About Us", "Help & Contact", "Careers"];

function SocialIcon({ children, href }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="w-9 h-9 rounded-full border border-gray-600 flex items-center justify-center text-gray-300 hover:text-white hover:border-white transition-colors"
    >
      {children}
    </a>
  );
}

export default function Footer() {
  return (
    <footer className="bg-black text-white mt-12">
      <div className="max-w-screen-xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Col 1 — Logo + Social */}
          <div className="flex flex-col gap-6">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <span style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontWeight: 900, fontSize: "28px", color: "#fff", letterSpacing: "-1px" }}>
                fastrack
              </span>
              <svg width="22" height="28" viewBox="0 0 22 28" fill="none">
                <polygon points="13,0 0,16 9,16 9,28 22,12 13,12" fill="#F47A20" />
              </svg>
            </div>

            {/* Social icons */}
            <div className="flex gap-3">
              {/* Facebook */}
              <SocialIcon href="#">
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </SocialIcon>
              {/* X/Twitter */}
              <SocialIcon href="#">
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </SocialIcon>
              {/* Instagram */}
              <SocialIcon href="#">
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                </svg>
              </SocialIcon>
              {/* YouTube */}
              <SocialIcon href="#">
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-1.96C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.4 19.54C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
                </svg>
              </SocialIcon>
              {/* Pinterest */}
              <SocialIcon href="#">
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
                </svg>
              </SocialIcon>
            </div>

            {/* Contact */}
            <div>
              <p className="text-xs font-bold tracking-widest text-gray-400 mb-3">CONTACT US</p>
              <p className="text-sm text-gray-300 mb-1">1800-266-0123</p>
              <p className="text-sm text-gray-300 mb-1">customercare@titan.co.in</p>
              <p className="text-sm text-gray-300 cursor-pointer hover:text-white transition-colors">FAQs</p>
            </div>
          </div>

          {/* Col 2 — Customer Service */}
          <div>
            <p className="text-xs font-bold tracking-widest text-gray-400 mb-4">CUSTOMER SERVICE</p>
            <ul className="flex flex-col gap-3">
              {customerService.map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Policies */}
          <div>
            <p className="text-xs font-bold tracking-widest text-gray-400 mb-4">POLICIES</p>
            <ul className="flex flex-col gap-3">
              {policies.map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — About + App Download */}
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-xs font-bold tracking-widest text-gray-400 mb-4">ABOUT FASTRACK</p>
              <ul className="flex flex-col gap-3">
                {about.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* App download */}
            <div>
              <p className="text-xs font-bold tracking-widest text-gray-400 mb-3">DOWNLOAD THE TITAN APP</p>
              <div className="flex flex-col gap-2">
                {/* App Store */}
                <a
                  href="#"
                  className="flex items-center gap-2 border border-gray-600 rounded px-3 py-2 hover:border-white transition-colors"
                >
                  <svg width="18" height="18" fill="white" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  <div>
                    <p className="text-gray-400 text-xs leading-none">Download on the</p>
                    <p className="text-white text-sm font-semibold">App Store</p>
                  </div>
                </a>
                {/* Google Play */}
                <a
                  href="#"
                  className="flex items-center gap-2 border border-gray-600 rounded px-3 py-2 hover:border-white transition-colors"
                >
                  <svg width="18" height="18" fill="white" viewBox="0 0 24 24">
                    <path d="M3.18 23.76c.3.17.64.24.99.2l12.6-12.6L13.2 7.8 3.18 23.76zm17.28-10.8L17.7 11.4l-3.3 3.3 3.06 5.4 3-1.68c.6-.33.96-.96.96-1.62s-.36-1.29-.96-1.62zM3 1.2c-.18.3-.3.66-.3 1.08V21.6c0 .42.12.78.3 1.08L15.6 10.2 3 1.2zm10.2 9L3.18.24c-.3-.18-.63-.24-.97-.2l12.6 12.57L13.2 10.2z" />
                  </svg>
                  <div>
                    <p className="text-gray-400 text-xs leading-none">GET IT ON</p>
                    <p className="text-white text-sm font-semibold">Google Play</p>
                  </div>
                </a>
              </div>
            </div>

            {/* WhatsApp */}
            <div>
              <p className="text-xs font-bold tracking-widest text-gray-400 mb-1">NEED HELP?</p>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
                Chat with us on <span className="text-green-400 underline">WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-10 pt-5 text-center">
          <p className="text-xs text-gray-600">© 2025 Fastrack. A Titan Company. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}