import Link from 'next/link'
import { Layers, Heart, Globe, Shield, ArrowRight } from 'lucide-react'

export default function SobrePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Layers size={32} className="text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Sobre o 3D Livre</h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Um repositório gratuito e aberto de modelos para impressão 3D, criado pela e para a comunidade maker brasileira.
        </p>
      </div>

      <div className="prose prose-gray max-w-none">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: Heart, title: '100% Gratuito', desc: 'Nenhum modelo é pago. Nenhuma assinatura. Nenhuma cobrança. Para sempre.', color: 'bg-red-100 text-red-600' },
            { icon: Globe, title: 'Comunidade Aberta', desc: 'Qualquer pessoa pode navegar e baixar. Login apenas para enviar e interagir.', color: 'bg-blue-100 text-blue-600' },
            { icon: Shield, title: 'Licenças Claras', desc: 'Cada modelo tem licença definida pelo autor para uso transparente e seguro.', color: 'bg-green-100 text-green-600' },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-xl border border-gray-200 p-6 text-center">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 ${item.color}`}>
                <item.icon size={24} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Nossa missão</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            O 3D Livre nasceu da vontade de criar um espaço democrático e acessível onde makers, engenheiros, professores, estudantes e entusiastas possam compartilhar e descobrir modelos para impressão 3D sem barreiras.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            Acreditamos que o conhecimento e a criatividade devem circular livremente. Por isso, todos os modelos disponíveis nesta plataforma são gratuitos e acompanham licenças de uso claras, respeitando os direitos dos criadores e dos usuários.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Nossa plataforma é um projeto open source mantido pela comunidade, para a comunidade.
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
          <h3 className="font-bold text-amber-900 mb-2">⚠️ Aviso importante</h3>
          <p className="text-amber-800 text-sm leading-relaxed">
            Os modelos disponíveis nesta plataforma são enviados pelos usuários da comunidade. O 3D Livre não se responsabiliza pela segurança, precisão, adequação ou legalidade dos arquivos publicados. Sempre verifique a segurança e a adequação de qualquer modelo antes de imprimir ou utilizar. Modelos de peças de reposição, acessórios médicos ou itens de segurança devem ser validados por profissionais qualificados.
          </p>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Faça parte da comunidade</h2>
          <p className="text-gray-600 mb-6">Compartilhe seus modelos, baixe, comente, avalie e ajude a construir o maior repositório gratuito de impressão 3D do Brasil.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/explorar" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 justify-center">
              Explorar peças <ArrowRight size={16} />
            </Link>
            <Link href="/cadastro" className="border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
              Criar conta gratuita
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
