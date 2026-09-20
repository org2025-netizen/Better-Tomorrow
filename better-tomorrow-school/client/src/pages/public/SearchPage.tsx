import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import SearchInput from '@/components/common/SearchInput';

export default function SearchPage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-primary to-primary-800 text-white py-20">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Search</h1>
          <p className="text-white/70">Find what you are looking for</p>
        </div>
      </section>
      <section className="section-padding bg-white">
        <div className="container-custom max-w-2xl">
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Search for programs, news, events..." className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div className="text-center py-12 text-gray-500">
            <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Type something to search across the website</p>
          </div>
        </div>
      </section>
    </div>
  );
}
