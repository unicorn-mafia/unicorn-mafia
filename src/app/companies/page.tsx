"use client";
import { useEffect, useState } from 'react';
import yaml from 'js-yaml';

export default function Companies() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/companies.yaml')
      .then((response) => response.text())
      .then((text) => {
        setData(yaml.load(text));
      });
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-5xl font-bold text-center mb-12">Companies</h1>
      {data.domains.map((domain) => (
        <div key={domain.name} className="mb-12">
          <h2 className="text-3xl font-bold mb-6">{domain.name}</h2>
          {domain.categories.map((category) => (
            <div key={category.name} className="mb-8">
              <h3 className="text-2xl font-semibold mb-4">{category.name}</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg shadow-md">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Website</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {category.tools.map((tool) => (
                      <tr key={tool.name} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {tool.icon_url && <img src={tool.icon_url} alt={tool.name} className="h-10 w-10 mr-4 rounded-full object-contain" />}
                            <span className="font-medium">{tool.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-pre-wrap">{tool.description}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <a href={tool.website_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 transition-colors">
                            {tool.website_url}
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
