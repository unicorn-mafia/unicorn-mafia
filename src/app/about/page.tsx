import React from 'react';
import { getTeamData } from '../_lib/team';
import TeamMember from '../_components/about/team-member';
import Navbar from '../_components/navbar/navbar';

export const metadata = {
  title: 'About Us - Unicorn Mafia',
  description: 'Meet the team behind London\'s elite developer community. Discover the passionate individuals driving innovation and building the future.',
};

export default async function AboutPage() {
  const teamData = await getTeamData();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pt-20 pb-16">
          <div className="text-center space-y-6">
            <h1 className="font-inter font-bold text-5xl md:text-6xl lg:text-7xl tracking-tight text-gray-900">
              Meet the Team
            </h1>
            <p className="font-inter text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              The passionate individuals behind London's most exclusive developer community, 
              dedicated to building the future of tech together.
            </p>
          </div>
        </div>
        
        {/* Gradient separator */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
      </div>

      {/* Mission Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="font-inter font-bold text-3xl md:text-4xl tracking-tight text-gray-900">
                Our Mission
              </h2>
              <p className="font-inter text-lg text-gray-600 leading-relaxed">
                Unicorn Mafia exists to connect London's most talented developers, engineers, and founders. 
                We believe that great things happen when brilliant minds collaborate, share knowledge, and 
                build together.
              </p>
              <p className="font-inter text-lg text-gray-600 leading-relaxed">
                Through exclusive events, hackathons, and networking opportunities, we're fostering 
                the next generation of unicorn companies and technical leaders.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-2xl text-center">
                <div className="font-mono text-3xl font-bold text-purple-600 mb-2">500+</div>
                <div className="font-inter text-sm text-gray-600">Active Members</div>
              </div>
              <div className="bg-gray-50 p-6 rounded-2xl text-center">
                <div className="font-mono text-3xl font-bold text-blue-600 mb-2">100+</div>
                <div className="font-inter text-sm text-gray-600">Events Hosted</div>
              </div>
              <div className="bg-gray-50 p-6 rounded-2xl text-center">
                <div className="font-mono text-3xl font-bold text-green-600 mb-2">30+</div>
                <div className="font-inter text-sm text-gray-600">Startups Founded</div>
              </div>
              <div className="bg-gray-50 p-6 rounded-2xl text-center">
                <div className="font-mono text-3xl font-bold text-red-600 mb-2">£50M+</div>
                <div className="font-inter text-sm text-gray-600">Funding Raised</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          <div className="text-center mb-16">
            <h2 className="font-inter font-bold text-4xl md:text-5xl tracking-tight text-gray-900 mb-6">
              The People Behind the Magic
            </h2>
            <p className="font-inter text-xl text-gray-600 max-w-2xl mx-auto">
              Meet the dedicated team members who make Unicorn Mafia the premier 
              developer community in London.
            </p>
          </div>
          
          {/* Team Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamData.team.map((member, index) => (
              <TeamMember key={index} member={member} />
            ))}
          </div>
        </div>
      </div>

      {/* Join CTA */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-6 md:px-12 lg:px-20 text-center">
          <h2 className="font-inter font-bold text-3xl md:text-4xl tracking-tight text-gray-900 mb-6">
            Want to Join Our Team?
          </h2>
          <p className="font-inter text-lg text-gray-600 mb-8 leading-relaxed">
            We're always looking for passionate individuals who share our mission of building 
            London's most vibrant developer community. If you're interested in contributing, 
            we'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/#contact"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-black hover:bg-gray-800 transition-colors duration-200"
            >
              Get in Touch
            </a>
            <a
              href="/companies"
              className="inline-flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              View Our Companies
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}