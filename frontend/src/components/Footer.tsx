export default function Footer() {
  return (
    <footer className="w-full py-8 px-4 mt-auto">
      <div className="max-w-2xl mx-auto">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="space-y-3">
            <h3 className="text-white font-semibold text-sm">Informações do Desenvolvedor</h3>
            <div className="space-y-2 text-sm text-zinc-400">
              <p>
                <span className="text-zinc-500">Nome:</span> Gabriel Rodrigues Santos
              </p>
              <p>
                <span className="text-zinc-500">Email:</span> gabrielrodriguesec63@gmail.com
              </p>
              <p>
                <span className="text-zinc-500">GitHub:</span> <a href="https://github.com/gabrielrsnts" target="_blank" rel="noopener noreferrer">github.com/gabrielrsnts</a>
              </p>
              <p>
                <span className="text-zinc-500">Linkedin:</span> <a href="https://www.linkedin.com/in/gabrielrsnts" target="_blank" rel="noopener noreferrer">linkedin.com/in/gabrielrsnts/</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
