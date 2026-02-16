import { Users, Target, Award, Zap, Mail, MapPin, Phone } from 'lucide-react';

const About = () => {
  const stats = [
    { label: 'Articles Published', value: '10,000+', icon: Award },
    { label: 'Active Readers', value: '500K+', icon: Users },
    { label: 'Countries Reached', value: '150+', icon: MapPin },
    { label: 'Daily Updates', value: '50+', icon: Zap },
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'Editor in Chief',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      bio: '15+ years in journalism with focus on investigative reporting.',
    },
    {
      name: 'Michael Chen',
      role: 'Lead Tech Reporter',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      bio: 'Covering technology trends and innovation for over a decade.',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Politics Editor',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      bio: 'Award-winning political analyst and columnist.',
    },
    {
      name: 'David Kim',
      role: 'Business Correspondent',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      bio: 'Expert in global markets and economic policy.',
    },
  ];

  const values = [
    {
      icon: Target,
      title: 'Accuracy First',
      description: 'We verify every fact and source before publishing, ensuring our readers get reliable information.',
    },
    {
      icon: Users,
      title: 'Reader-Focused',
      description: 'Our content is crafted with you in mind, delivering news that matters to your daily life.',
    },
    {
      icon: Zap,
      title: 'Breaking News',
      description: 'Stay ahead with real-time updates on the stories shaping our world.',
    },
    {
      icon: Award,
      title: 'Quality Journalism',
      description: 'Our team of experienced journalists brings depth and context to every story.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
     
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            About Inkstone
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
            Delivering truth, transparency, and timely news to readers worldwide since 2010.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg p-6 text-center transform hover:scale-105 transition"
            >
              <stat.icon className="w-8 h-8 mx-auto mb-3 text-blue-600" />
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-gray-600 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

    
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6 text-gray-900">Our Mission</h2>
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              At Inkstone, we believe in the power of informed citizens. Our mission is to deliver 
              accurate, unbiased news coverage that empowers readers to make informed decisions.
            </p>
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              We're committed to journalistic integrity, thorough fact-checking, and presenting 
              diverse perspectives on the issues that matter most.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Whether it's breaking news, in-depth analysis, or investigative reporting, we strive 
              to be your trusted source for information in an ever-changing world.
            </p>
          </div>
          <div>
            <img
              src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800"
              alt="Newsroom"
              className="rounded-lg shadow-xl w-full h-96 object-cover"
            />
          </div>
        </div>
      </div>

    
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide our newsroom and editorial decisions every day.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-lg hover:shadow-lg transition"
              >
                <value.icon className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                <h3 className="text-xl font-bold mb-3 text-gray-900">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experienced journalists dedicated to bringing you the news that matters.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1 text-gray-900">
                  {member.name}
                </h3>
                <p className="text-blue-600 font-semibold mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Get In Touch</h2>
            <p className="text-xl text-gray-300">
              Have a story tip or question? We'd love to hear from you.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <Mail className="w-10 h-10 mx-auto mb-3 text-blue-400" />
              <h3 className="font-semibold mb-2">Email Us</h3>
              <a
                href="mailto:contact@inkstone.com"
                className="text-gray-300 hover:text-white transition"
              >
                contact@inkstone.com
              </a>
            </div>
            <div className="text-center">
              <Phone className="w-10 h-10 mx-auto mb-3 text-blue-400" />
              <h3 className="font-semibold mb-2">Call Us</h3>
              <a
                href="tel:+1234567890"
                className="text-gray-300 hover:text-white transition"
              >
                +1 (234) 567-890
              </a>
            </div>
            <div className="text-center">
              <MapPin className="w-10 h-10 mx-auto mb-3 text-blue-400" />
              <h3 className="font-semibold mb-2">Visit Us</h3>
              <p className="text-gray-300">
                123 News Street<br />New York, NY 10001
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;