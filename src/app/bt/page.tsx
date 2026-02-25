export default function BigTony() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <div className="border border-black p-8 md:p-12 text-center space-y-8">
          <div className="flex justify-center">
            <img 
              src="https://wassist.app/logo-full.svg" 
              alt="Wassist Logo" 
              className="h-16 md:h-20"
            />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-title font-medium tracking-tight">
              BIG TONY
            </h1>
            <p className="text-sm md:text-base font-body text-gray-600">
              Unicorn Mafia&apos;s community bot
            </p>
          </div>

          <a
            href="https://wa.me/447488895960?text=i%27ve%20got%20what%20it%20takes"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-black text-white font-body py-4 px-6 hover:bg-gray-800 transition-colors border border-black"
          >
            MESSAGE ON WHATSAPP
          </a>

          <div className="text-xs font-body text-gray-500 pt-4 border-t border-gray-200">
            Developed by Josh Warwick
          </div>
        </div>
      </div>
    </div>
  );
}
