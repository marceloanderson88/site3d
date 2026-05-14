export default function TermosPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Termos de Uso</h1>
      <p className="text-gray-500 mb-8">Última atualização: Janeiro de 2025</p>

      <div className="space-y-8 text-gray-700">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">1. Sobre a plataforma</h2>
          <p className="leading-relaxed">
            O 3D Livre é uma plataforma gratuita e de código aberto para compartilhamento de modelos para impressão 3D. Não realizamos vendas, cobranças ou marketplace. O uso é totalmente gratuito e assim permanecerá.
          </p>
        </section>

        <section id="arquivos">
          <h2 className="text-xl font-bold text-gray-900 mb-3">2. Política de envio de arquivos</h2>
          <p className="leading-relaxed mb-3">Ao enviar um modelo, você declara que:</p>
          <ul className="list-disc pl-6 space-y-2 text-sm">
            <li>É o autor original ou possui os direitos necessários para compartilhar o arquivo.</li>
            <li>O modelo não viola direitos autorais, marcas registradas ou patentes de terceiros.</li>
            <li>O conteúdo não é ilegal, ofensivo, perigoso ou prejudicial.</li>
            <li>O arquivo está em um dos formatos aceitos: STL, OBJ, 3MF, STEP ou ZIP.</li>
            <li>Você está de acordo com a licença selecionada para o modelo.</li>
          </ul>
          <p className="mt-3 leading-relaxed text-sm">
            O 3D Livre reserva-se o direito de remover qualquer modelo que viole estas diretrizes sem aviso prévio.
          </p>
        </section>

        <section id="licencas">
          <h2 className="text-xl font-bold text-gray-900 mb-3">3. Política de licenças</h2>
          <p className="leading-relaxed mb-3">Cada modelo publicado deve ter uma licença de uso definida pelo autor. Licenças disponíveis:</p>
          <div className="space-y-3">
            {[
              { name: 'CC0 — Domínio Público', desc: 'O autor renuncia a todos os direitos. Qualquer uso é permitido sem restrições.' },
              { name: 'CC BY — Atribuição', desc: 'Uso livre com crédito ao autor original.' },
              { name: 'CC BY-SA — Atribuição-CompartilhaIgual', desc: 'Uso livre com crédito e derivados devem usar a mesma licença.' },
              { name: 'CC BY-NC — Atribuição-NãoComercial', desc: 'Uso permitido apenas para fins não comerciais.' },
              { name: 'CC BY-NC-SA — Atribuição-NãoComercial-CompartilhaIgual', desc: 'Não comercial e derivados com mesma licença.' },
              { name: 'Uso Pessoal', desc: 'Apenas para uso pessoal e privado. Não pode ser redistribuído.' },
            ].map((lic) => (
              <div key={lic.name} className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold text-gray-900 text-sm">{lic.name}</p>
                <p className="text-xs text-gray-600 mt-1">{lic.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">4. Responsabilidade sobre os arquivos</h2>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
            <p className="text-amber-900 font-semibold mb-2">⚠️ Aviso de segurança</p>
            <p className="text-amber-800 text-sm leading-relaxed">
              Os modelos são criados e enviados por usuários da comunidade. O 3D Livre não verifica, certifica ou garante a segurança, precisão ou adequação de nenhum modelo. Sempre avalie criticamente qualquer arquivo antes de imprimir e usar, especialmente peças estruturais, de segurança ou acessórios médicos. O uso de qualquer modelo é de inteira responsabilidade do usuário.
            </p>
          </div>
        </section>

        <section id="privacidade">
          <h2 className="text-xl font-bold text-gray-900 mb-3">5. Privacidade e dados</h2>
          <p className="leading-relaxed mb-3">Coletamos apenas os dados necessários para o funcionamento da plataforma:</p>
          <ul className="list-disc pl-6 space-y-2 text-sm">
            <li>Email e nome para criação de conta (via Supabase Auth).</li>
            <li>Modelos, comentários e avaliações enviados voluntariamente.</li>
            <li>Registros de downloads para contagem (sem identificação pessoal para usuários não logados).</li>
          </ul>
          <p className="mt-3 text-sm leading-relaxed">Não vendemos, compartilhamos ou comercializamos dados de usuários.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">6. Moderação e denúncias</h2>
          <p className="leading-relaxed text-sm">
            Peças enviadas passam por revisão antes de serem publicadas. Usuários podem denunciar modelos ou comentários inadequados. Administradores podem remover qualquer conteúdo que viole estes termos.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">7. Contato</h2>
          <p className="leading-relaxed text-sm">
            Para dúvidas, sugestões ou denúncias, entre em contato através da página <a href="/sobre" className="text-blue-600 hover:underline">Sobre</a>.
          </p>
        </section>
      </div>
    </div>
  )
}
