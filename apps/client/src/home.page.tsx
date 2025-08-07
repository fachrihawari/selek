import { Button } from './components';

export function meta() {
  return [
    { title: 'Selek - Team Communication Made Simple' },
    {
      name: 'description',
      content:
        'Connect, collaborate, and communicate with your team in real-time using Selek - the modern platform for team chat and collaboration.',
    },
  ];
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-100 to-white flex flex-col justify-between">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center py-16">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-gray-900 animate-fade-in">
            <span className="bg-gradient-to-r from-orange-800 to-orange-600 bg-clip-text text-transparent">
              Selek
            </span>
            <span className="block mt-2 text-4xl md:text-6xl">
              Where Teams Thrive Together
            </span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-base text-gray-600 sm:text-lg md:mt-6 md:text-xl">
            Connect, collaborate, and communicate with your team in real-time. Selek brings all your team communication into one place—searchable, secure, and accessible anywhere.
          </p>
          <div className="mt-8 flex flex-col md:flex-row justify-center gap-3">
            <Button size="lg" to="/register">
              Get Started for Free
            </Button>
            <Button
              size="lg"
              variant="secondary"
              to="/login"
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white/80 backdrop-blur-sm border-t border-orange-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">All-in-One Team Collaboration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FeatureCard
              title="Multi-Workspace Support"
              description="Organize your teams and projects with separate workspaces. Switch between workspaces seamlessly."
              icon={<span className="text-3xl">🏢</span>}
            />
            <FeatureCard
              title="Real-time Messaging"
              description="Chat instantly with your team using channels, group chats, and direct messages. Powered by Socket.IO."
              icon={<span className="text-3xl">💬</span>}
            />
            <FeatureCard
              title="Channels & DMs"
              description="Create channels for topics, or start direct and group conversations."
              icon={<span className="text-3xl">#️⃣</span>}
            />
            <FeatureCard
              title="User Presence"
              description="See who is online or away, and stay connected with your team in real-time."
              icon={<span className="text-3xl">🟢</span>}
            />
            <FeatureCard
              title="Role-based Access"
              description="Manage members with owner, admin, and member roles. Secure your workspace with granular permissions."
              icon={<span className="text-3xl">🛡️</span>}
            />
            <FeatureCard
              title="Responsive & Accessible"
              description="Enjoy a beautiful, fast, and accessible experience on any device."
              icon={<span className="text-3xl">📱</span>}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-gray-400">
        Built with <span className="text-orange-600">&#10084;&#65039;</span> by Fachri Hawari &middot; <a href="https://github.com/fachrihawari/selek" className="underline hover:text-orange-700">GitHub</a>
      </footer>
    </div>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <div className="flex items-start gap-4 p-5 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-orange-100">
      <div className="flex-shrink-0">{icon}</div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </div>
  );
}
