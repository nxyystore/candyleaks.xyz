import React, { useState, useEffect } from 'react';
import { Copy, Key, Check, Sparkles, Shield, Clock, Lock, Zap, Loader, Server, Users, Gift } from 'lucide-react';
import { Notification } from './Notification';

interface KeyGeneratorProps {
  serverId: string;
}

interface ServerInfo {
  id: string;
  name: string;
  icon: string | null;
}

export function KeyGenerator({ serverId }: KeyGeneratorProps) {
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [hasGeneratedOnce, setHasGeneratedOnce] = useState(false);
  const [serverInfo, setServerInfo] = useState<ServerInfo | null>(null);
  const [isLoadingServer, setIsLoadingServer] = useState(true);
  const [activeTab, setActiveTab] = useState<'generator' | 'about'>('generator');

  useEffect(() => {
    // Track visitor when component mounts
    const trackVisitor = async () => {
      try {
        await fetch('https://api-fr.sexyleaks.xyz/api/trackVisitor', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ serverId }),
        });
      } catch (error) {
        console.error('Error tracking visitor:', error);
      }
    };

    trackVisitor();
    
    // Fetch server info
    const fetchServerInfo = async () => {
      setIsLoadingServer(true);
      try {
        const response = await fetch(`https://api-fr.sexyleaks.xyz/api/server/${serverId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch server info');
        }
        const data = await response.json();
        setServerInfo(data);
      } catch (error) {
        console.error('Error fetching server info:', error);
        setServerInfo(null);
      } finally {
        setIsLoadingServer(false);
      }
    };
    
    fetchServerInfo();
  }, [serverId]);

  const generateKey = async () => {
    setIsGenerating(true);
    setError(null);
  
    try {
      const response = await fetch('https://api-fr.sexyleaks.xyz/api/generateKey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ guildId: serverId }),
      });
  
      const data = await response.json();
  
      if (response.ok && data.key) {
        setGeneratedKey(data.key);
        setHasGeneratedOnce(true);
      } else {
        throw new Error(data.error || 'Failed to generate key');
      }
    } catch (error) {
      console.error('Error generating key:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate key');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleGenerateNewKey = () => {
    if (hasGeneratedOnce) {
      window.open('https://best-links.org/s?s9LsJdJG', '_blank');
      setGeneratedKey(null);
    } else {
      setGeneratedKey(null);
    }
  };

  const copyToClipboard = async () => {
    if (generatedKey) {
      try {
        await navigator.clipboard.writeText(generatedKey);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
      } catch (err) {
        setError('Failed to copy to clipboard');
      }
    }
  };

  return (
    <>
      {showNotification && (
        <Notification 
          message="Sweet! Key copied successfully"
          type="success"
          position="bottom-right"
        />
      )}
      
      <div className="max-w-5xl w-full mx-auto relative">
        {/* Animated background elements */}
        <div className="absolute top-0 -right-4 w-96 h-96 bg-purple-600/20 rounded-full filter blur-3xl animate-blob"></div>
        <div className="absolute -bottom-8 -left-4 w-96 h-96 bg-blue-600/20 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-600/20 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
        
        {/* Server Info Banner */}
        {serverInfo && !isLoadingServer && (
          <div className="relative mb-8 overflow-hidden rounded-2xl glass-effect p-0.5 group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 via-pink-600/30 to-blue-600/30 opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
            <div className="relative flex items-center p-6 overflow-hidden">
              {/* Server Icon */}
              <div className="relative mr-6">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white/10 group-hover:border-white/20 transition-all duration-500 shadow-[0_0_15px_rgba(147,51,234,0.3)]">
                  {serverInfo.icon ? (
                    <img 
                      src={serverInfo.icon}
                      alt={serverInfo.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                      <Server className="w-10 h-10 text-white" />
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full flex items-center justify-center border-2 border-black">
                  <Check className="w-3 h-3 text-white" />
                </div>
              </div>
              
              {/* Server Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                    {serverInfo.name}
                  </h2>
                  <div className="px-2 py-1 bg-purple-500/20 rounded-full border border-purple-500/30 flex items-center gap-1">
                    <Users className="w-3 h-3 text-purple-400" />
                    <span className="text-xs text-purple-400 font-medium">VIP Access</span>
                  </div>
                </div>
                <p className="text-white/70 mt-1">
                  Generate your exclusive key to unlock premium content and features
                </p>
              </div>
              
              {/* Animated particles */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-purple-600/10 to-pink-600/10 rounded-full blur-xl animate-pulse"></div>
            </div>
          </div>
        )}
        
        {/* Loading State for Server */}
        {isLoadingServer && (
          <div className="relative mb-8 overflow-hidden rounded-2xl glass-effect p-6 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 border-4 border-t-purple-500 border-purple-500/30 rounded-full animate-spin"></div>
              <p className="text-white/70">Loading server information...</p>
            </div>
          </div>
        )}
        
        {/* Tabs */}
        <div className="flex mb-6 p-1 glass-effect rounded-xl">
          <button
            onClick={() => setActiveTab('generator')}
            className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 ${
              activeTab === 'generator' 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' 
                : 'text-white/70 hover:bg-white/5'
            }`}
          >
            <Key className="w-5 h-5" />
            <span>Key Generator</span>
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 ${
              activeTab === 'about' 
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg' 
                : 'text-white/70 hover:bg-white/5'
            }`}
          >
            <Gift className="w-5 h-5" />
            <span>VIP Benefits</span>
          </button>
        </div>

        {activeTab === 'generator' && (
          <div className="relative grid md:grid-cols-2 gap-8">
            {/* Left Column - Key Generation */}
            <div className="glass-effect rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-bl-[100px] filter blur-xl"></div>
              
              <div className="relative z-10 space-y-8">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center transform hover:scale-110 transition-transform duration-500 group overflow-hidden">
                      <Key className="w-10 h-10 text-white transform group-hover:rotate-12 transition-transform duration-500" />
                      <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-pulse" />
                    </div>
                  </div>
                  
                  <div className="text-center space-y-2">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      VIP Access Key
                    </h2>
                    <p className="text-white/70">
                      Generate your exclusive key for VIP access
                    </p>
                  </div>
                </div>

                {error && (
                  <div className="w-full bg-red-500/10 border border-red-500/20 rounded-lg p-4 animate-shake">
                    <p className="text-red-400 text-sm text-center">{error}</p>
                  </div>
                )}

                {generatedKey ? (
                  <div className="space-y-6">
                    <div className="relative">
                      <div className="glass-effect rounded-lg p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-white/70 text-sm">Your Generated Key:</p>
                          <button
                            onClick={copyToClipboard}
                            className="p-2 rounded-md hover:bg-white/10 transition-all duration-300 group"
                          >
                            <Copy className="w-5 h-5 text-white/70 group-hover:text-white transition-colors duration-300" />
                          </button>
                        </div>
                        <div className="font-mono text-xl text-center text-white break-all bg-black/40 p-4 rounded-lg border border-white/10 relative overflow-hidden group">
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-pink-600/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          <div className="relative">{generatedKey}</div>
                        </div>
                      </div>
                      
                      {/* Key expiration notice */}
                      <div className="mt-4 flex items-center gap-2 text-amber-400 text-sm">
                        <Clock className="w-4 h-4" />
                        <span>This key will expire in 24 hours</span>
                      </div>
                    </div>

                    <button
                      onClick={handleGenerateNewKey}
                      className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg transition-all duration-500 transform hover:translate-y-[-2px] hover:shadow-[0_0_30px_rgba(147,51,234,0.3)] flex items-center justify-center gap-2 group"
                    >
                      <Key className="w-5 h-5 group-hover:rotate-12 transition-transform duration-500" />
                      Generate New Key
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={generateKey}
                    disabled={isGenerating}
                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg transition-all duration-500 transform hover:translate-y-[-2px] hover:shadow-[0_0_30px_rgba(147,51,234,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                  >
                    {isGenerating ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Key className="w-5 h-5 group-hover:rotate-12 transition-transform duration-500" />
                        Generate Key
                      </>
                    )}
                  </button>
                )}
                
                {/* How to use section */}
                <div className="mt-6 space-y-4">
                  <h3 className="text-lg font-semibold text-white">How to use your key:</h3>
                  <ol className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-sm">1</div>
                      <p className="text-white/70">Copy the generated key</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-sm">2</div>
                      <p className="text-white/70">Return to Discord and click "Redeem Key"</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-sm">3</div>
                      <p className="text-white/70">Paste your key and enjoy VIP access!</p>
                    </li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Right Column - Features */}
            <div className="space-y-4">
              {/* Server Preview Card */}
              {serverInfo && !isLoadingServer && (
                <div className="glass-effect rounded-2xl p-8 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-blue-600/10 transform group-hover:scale-105 transition-transform duration-500"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-400 to-blue-600 flex items-center justify-center">
                        <Server className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-blue-600 bg-clip-text text-transparent">
                        Server Preview
                      </h3>
                    </div>
                    
                    <div className="bg-black/30 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-3 mb-3">
                        {serverInfo.icon ? (
                          <img 
                            src={serverInfo.icon}
                            alt={serverInfo.name}
                            className="w-10 h-10 rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                            <Server className="w-5 h-5 text-white" />
                          </div>
                        )}
                        <div>
                          <h4 className="text-white font-medium">{serverInfo.name}</h4>
                          <p className="text-white/50 text-xs">ID: {serverInfo.id}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          <span className="text-white/70 text-sm">VIP channels available</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                          <span className="text-white/70 text-sm">Premium content unlocked</span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-white/60 text-sm italic">
                      Your VIP access will be activated immediately after redeeming your key in the Discord server.
                    </p>
                  </div>
                </div>
              )}

              {/* VIP Benefits Card */}
              <div className="glass-effect rounded-2xl p-8 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10 transform group-hover:scale-105 transition-transform duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                      <Crown className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                      VIP Benefits
                    </h3>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-3 text-white/80">
                      <Check className="w-5 h-5 text-green-400" />
                      <span>Exclusive VIP role for 60 minutes</span>
                    </li>
                    <li className="flex items-center gap-3 text-white/80">
                      <Check className="w-5 h-5 text-green-400" />
                      <span>Access to premium channels</span>
                    </li>
                    <li className="flex items-center gap-3 text-white/80">
                      <Check className="w-5 h-5 text-green-400" />
                      <span>Special Discord perks</span>
                    </li>
                    <li className="flex items-center gap-3 text-white/80">
                      <Check className="w-5 h-5 text-green-400" />
                      <span>Early access to new content</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Security Features Card */}
              <div className="glass-effect rounded-2xl p-8 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-cyan-600/10 transform group-hover:scale-105 transition-transform duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-600 flex items-center justify-center">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-600 bg-clip-text text-transparent">
                      Security
                    </h3>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-3 text-white/80">
                      <Lock className="w-5 h-5 text-blue-400" />
                      <span>Encrypted key generation</span>
                    </li>
                    <li className="flex items-center gap-3 text-white/80">
                      <Clock className="w-5 h-5 text-blue-400" />
                      <span>Time-limited access</span>
                    </li>
                    <li className="flex items-center gap-3 text-white/80">
                      <Zap className="w-5 h-5 text-blue-400" />
                      <span>Instant activation</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'about' && (
          <div className="glass-effect rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full filter blur-3xl"></div>
            
            <div className="relative z-10">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  VIP Membership Benefits
                </h2>
                <p className="text-white/70 max-w-2xl mx-auto">
                  Unlock exclusive content and features with your VIP access. Here's everything you get with your membership:
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  {/* Premium Content */}
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-purple-500/30 transition-all duration-300 group">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Gift className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors duration-300">Premium Content</h3>
                    </div>
                    <p className="text-white/70">
                      Access exclusive premium content not available to regular members. Includes special collections, early releases, and VIP-only material.
                    </p>
                  </div>
                  
                  {/* Special Role */}
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-blue-500/30 transition-all duration-300 group">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Crown className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300">Special Role</h3>
                    </div>
                    <p className="text-white/70">
                      Stand out with a distinctive VIP role that highlights your status in the server. Enjoy recognition and respect from other members.
                    </p>
                  </div>
                  
                  {/* Priority Support */}
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-green-500/30 transition-all duration-300 group">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <MessageCircle className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white group-hover:text-green-400 transition-colors duration-300">Priority Support</h3>
                    </div>
                    <p className="text-white/70">
                      Get faster responses and dedicated assistance from server moderators and admins. Your questions and concerns are prioritized.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {/* Exclusive Channels */}
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-amber-500/30 transition-all duration-300 group">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Lock className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors duration-300">Exclusive Channels</h3>
                    </div>
                    <p className="text-white/70">
                      Access VIP-only channels where premium content is shared and discussed. Connect with other VIP members in a more exclusive environment.
                    </p>
                  </div>
                  
                  {/* Early Access */}
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-indigo-500/30 transition-all duration-300 group">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors duration-300">Early Access</h3>
                    </div>
                    <p className="text-white/70">
                      Be among the first to see new content and features before they're released to the general server population.
                    </p>
                  </div>
                  
                  {/* Community Recognition */}
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-rose-500/30 transition-all duration-300 group">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white group-hover:text-rose-400 transition-colors duration-300">Community Recognition</h3>
                    </div>
                    <p className="text-white/70">
                      Enjoy enhanced visibility in the community with special mentions and acknowledgments. Your contributions are more likely to be featured.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-10 text-center">
                <button
                  onClick={() => setActiveTab('generator')}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg transition-all duration-500 transform hover:translate-y-[-2px] hover:shadow-[0_0_30px_rgba(147,51,234,0.3)] flex items-center justify-center gap-2 mx-auto"
                >
                  <Key className="w-5 h-5" />
                  Generate Your VIP Key Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function Crown(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
    </svg>
  );
}

function MessageCircle(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  );
}