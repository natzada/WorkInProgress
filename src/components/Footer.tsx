import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { Navigate } from 'react-router-dom';
import { faInstagram, faLinkedinIn, faYoutube } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <footer className="bg-footer text-white py-12 px-6 z-50">
      <div className="max-w-6xl mx-auto grid grid-cols md:grid-cols-2 gap-12">
        {/* WIP Info */}
        <div className="space-y-4">
          <div className="text-white text-xl font-semibold">
            WIP – Working in Progress
          </div>
          <p className="text-neutral-400">
            Somos a parceira digital dos pequenos e médios negócios.<br />
            Oferecemos ferramentas simples para controle, organização e crescimento.<br />
            Porque empreender não precisa ser complicado.
          </p>
        </div>

        {/* Navigation */}
        <div className="space-y-4">
          <h3 className="text-white text-xl font-semibold">Navegue</h3>
          <ul className="space-y-2 text-neutral-400">
            <li className='cursor-pointer hover:text-neutral-300'>Início</li>
            <li className='cursor-pointer hover:text-neutral-300'>Compras</li>
            <li className='cursor-pointer hover:text-neutral-300'>Tutoriais</li>
            <li className='cursor-pointer hover:text-neutral-300'>Funcionalidades</li>
          </ul>
        </div>

        <div className="space-y-4">
            <h3 className="text-white text-xl font-semibold">Redes sociais</h3>
            <p className="text-neutral-400">
              Siga a WIP e acompanhe dicas, novidades e conteúdos para seu negócio crescer:
            </p>
            <div className="flex space-x-4">
              <FontAwesomeIcon icon={faInstagram} className="text-2xl text-white/70 cursor-pointer hover:text-white" />
              <FontAwesomeIcon icon={faLinkedinIn} className="text-2xl text-white/70 px-2 border-l-2 border-r-2 cursor-pointer hover:text-white" />
              <FontAwesomeIcon icon={faYoutube} className="text-2xl text-white/70 cursor-pointer hover:text-white" />
            </div>
          </div>

        {/* Social Media and Contact */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-white text-xl font-semibold">Fale com a gente</h3>
            <div className="text-neutral-400">
              <p>Email: contato@wipdigital.com.br</p>
              <p>WhatsApp: (11) 99999-9999</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;