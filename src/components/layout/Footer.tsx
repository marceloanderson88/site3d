import Link from 'next/link'
import { Layers } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Layers size={18} className="text-white" />
              </div>
              <span className="font-bold text-white text-lg">3D Livre</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              Repositório gratuito e aberto de modelos para impressão 3D.
              Compartilhe, baixe e imprima peças da comunidade maker.
            </p>
            <p className="text-xs text-gray-500 mt-3">
              Os arquivos são enviados pela comunidade. Verifique a segurança e adequação antes de imprimir.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-3 text-sm">Plataforma</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/explorar" className="hover:text-white transition-colors">Explorar Peças</Link></li>
              <li><Link href="/categorias" className="hover:text-white transition-colors">Categorias</Link></li>
              <li><Link href="/enviar" className="hover:text-white transition-colors">Enviar Peça</Link></li>
              <li><Link href="/sobre" className="hover:text-white transition-colors">Sobre o Projeto</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-3 text-sm">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/termos" className="hover:text-white transition-colors">Termos de Uso</Link></li>
              <li><Link href="/termos#privacidade" className="hover:text-white transition-colors">Privacidade</Link></li>
              <li><Link href="/termos#licencas" className="hover:text-white transition-colors">Política de Licenças</Link></li>
              <li><Link href="/termos#arquivos" className="hover:text-white transition-colors">Política de Envio</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} 3D Livre. Código aberto para a comunidade.</p>
          <p>Feito com ❤️ pela comunidade maker</p>
        </div>
      </div>
    </footer>
  )
}
