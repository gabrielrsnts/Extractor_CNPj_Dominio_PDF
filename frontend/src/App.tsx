import FileUpload from './components/FileUpload';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <main className="flex-1 flex items-center justify-center py-12">
        <FileUpload />
      </main>
      <Footer />
    </div>
  );
}

export default App;
