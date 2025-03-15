import React, { useState } from 'react';
import { Disc as Discord, Menu, X, MessageCircle as Telegram, Home } from 'lucide-react';
import { creators } from './src/data/creators';
import { CreatorCard } from './src/components/CreatorCard';
import { KeyGenerator } from './src/components/KeyGenerator';

function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const serverId = urlParams.get('serverid');
  const isGeneratorPage = window.location.pathname === '/gen';
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'trending' | 'top'>('all');

  const categories = [
    { id: 'all', label: 'ðŸŒŸ All' },
    { id: 'trending', label: 'ðŸ”¥ Trending' },
    { id: 'top', label: 'ðŸ‘‘ Top' },
  ];

  const filteredCreators = creators.filter(creator => 
    selectedCategory === 'all' ? true : creator.category === selectedCategory
  );

  const Logo = () => (
    <a href="/" className="group">
      <h1 className="text-3xl font-black relative flex items-center gap-2">
        <span className="text-2xl">ðŸ‘</span>
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 animate-gradient group-hover:from-indigo-500 group-hover:via-purple-500 group-hover:to-pink-500 transition-all duration-500">
        NSFW CONTENT
        </span>
        <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-lg blur opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
      </h1>
    </a>
  );

  const SocialLinks = () => (
    <div className="flex items-center gap-4">
      <a
        href="https://t.me/authediscord"
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full hover:bg-white/10 transition-all duration-300"
      >
        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.14-.26.26-.428.26l.213-3.05 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
        </svg>
      </a>
      <a
        href="https://discord.gg/fApfYRyJ3Q"
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full hover:bg-white/10 transition-all duration-300"
      >
        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.01c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12z"/>
        </svg>
      </a>
    </div>
  );

  if (isGeneratorPage && serverId) {
    return (
      <div className="min-h-screen bg-[#0a0118] bg-[radial-gradient(circle_at_50%_50%,rgba(92,38,255,0.15),rgba(0,0,0,0))]">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDUwIDAgTCAwIDAgMCA1MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDIpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
        <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
          <header className="flex justify-between items-center mb-12">
            <Logo />
            <SocialLinks />
          </header>
          <KeyGenerator serverId={serverId} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0118] bg-[radial-gradient(circle_at_50%_50%,rgba(92,38,255,0.15),rgba(0,0,0,0))]">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDUwIDAgTCAwIDAgMCA1MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDIpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        <header className="flex flex-col gap-8 mb-12">
          <div className="flex justify-between items-center">
            <Logo />
            <SocialLinks />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id as any)}
                className={`px-6 py-2.5 rounded-lg transition-all duration-300 whitespace-nowrap ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                    : 'text-white/70 hover:bg-white/10'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredCreators.map(creator => (
            <CreatorCard key={creator.name} creator={creator} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;