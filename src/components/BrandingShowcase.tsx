import { useState } from 'react';

const BrandingShowcase = () => {
  const [selectedColor, setSelectedColor] = useState('primary');
  const [selectedStyle, setSelectedStyle] = useState('modern');
  const [selectedMonogram, setSelectedMonogram] = useState('classic');

  const colorSchemes = {
    primary: {
      primary: 'from-orange-500 to-orange-600',
      accent: 'from-blue-600 to-blue-800',
      text: 'text-orange-900',
      bg: 'bg-orange-50'
    },
    corporate: {
      primary: 'from-orange-500 to-orange-600',
      accent: 'from-slate-700 to-slate-900',
      text: 'text-orange-900',
      bg: 'bg-orange-50'
    },
    premium: {
      primary: 'from-orange-500 to-orange-600',
      accent: 'from-indigo-600 to-indigo-800',
      text: 'text-orange-900',
      bg: 'bg-orange-50'
    },
    luxury: {
      primary: 'from-orange-500 to-orange-600',
      accent: 'from-emerald-600 to-emerald-800',
      text: 'text-orange-900',
      bg: 'bg-orange-50'
    },
    industrial: {
      primary: 'from-orange-500 to-orange-600',
      accent: 'from-zinc-700 to-zinc-900',
      text: 'text-orange-900',
      bg: 'bg-orange-50'
    }
  };

  const logoStyles = {
    modern: {
      container: 'rounded-xl',
      text: 'font-bold tracking-tight',
      tagline: 'tracking-widest'
    },
    classic: {
      container: 'rounded-lg',
      text: 'font-serif font-bold tracking-wide',
      tagline: 'tracking-wide'
    },
    minimal: {
      container: 'rounded-2xl',
      text: 'font-medium tracking-normal',
      tagline: 'tracking-normal'
    },
    geometric: {
      container: 'rounded-none',
      text: 'font-bold tracking-tighter',
      tagline: 'tracking-wider'
    }
  };

  const monogramStyles = {
    classic: {
      container: 'rounded-lg',
      text: 'font-serif font-bold',
      layout: 'flex items-center justify-center'
    },
    modern: {
      container: 'rounded-xl',
      text: 'font-bold',
      layout: 'flex items-center justify-center'
    },
    stacked: {
      container: 'rounded-lg',
      text: 'font-bold',
      layout: 'flex flex-col items-center justify-center'
    },
    geometric: {
      container: 'rounded-none',
      text: 'font-bold',
      layout: 'flex items-center justify-center'
    },
    minimal: {
      container: 'rounded-full',
      text: 'font-light',
      layout: 'flex items-center justify-center'
    },
    industrial: {
      container: 'rounded-none',
      text: 'font-black',
      layout: 'flex items-center justify-center'
    }
  };

  const currentScheme = colorSchemes[selectedColor];
  const currentStyle = logoStyles[selectedStyle];
  const currentMonogram = monogramStyles[selectedMonogram];

  return (
    <div className="min-h-screen bg-steel-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-steel-900 mb-4">Advanced Branding Options</h1>
          <p className="text-steel-600 max-w-2xl mx-auto">
            Explore comprehensive branding options for HOU GEN PROS. Customize colors, styles, and monograms to create your perfect brand identity.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 justify-center mb-12">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-steel-700">Color Scheme</label>
            <select 
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="rounded-lg border-steel-200 text-steel-700 focus:ring-accent focus:border-accent"
            >
              <option value="primary">Primary (Orange/Blue)</option>
              <option value="corporate">Corporate (Orange/Slate)</option>
              <option value="premium">Premium (Orange/Indigo)</option>
              <option value="luxury">Luxury (Orange/Emerald)</option>
              <option value="industrial">Industrial (Orange/Zinc)</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-steel-700">Logo Style</label>
            <select 
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value)}
              className="rounded-lg border-steel-200 text-steel-700 focus:ring-accent focus:border-accent"
            >
              <option value="modern">Modern</option>
              <option value="classic">Classic</option>
              <option value="minimal">Minimal</option>
              <option value="geometric">Geometric</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-steel-700">Monogram Style</label>
            <select 
              value={selectedMonogram}
              onChange={(e) => setSelectedMonogram(e.target.value)}
              className="rounded-lg border-steel-200 text-steel-700 focus:ring-accent focus:border-accent"
            >
              <option value="classic">Classic</option>
              <option value="modern">Modern</option>
              <option value="stacked">Stacked</option>
              <option value="geometric">Geometric</option>
              <option value="minimal">Minimal</option>
              <option value="industrial">Industrial</option>
            </select>
          </div>
        </div>

        {/* Monogram Showcase */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-steel-900 mb-8 text-center">Monogram Variations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Classic Monogram */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-[1.02]">
              <div className="flex justify-center mb-6">
                <div className={`w-32 h-32 bg-gradient-to-br ${currentScheme.primary} rounded-lg flex items-center justify-center shadow-lg relative group`}>
                  <div className="font-serif font-bold text-white text-5xl tracking-wider">HGP</div>
                  <div className="absolute inset-0 border-2 border-white/20 rounded-lg"></div>
                </div>
              </div>
              <p className="text-steel-600 text-sm text-center">Classic Monogram</p>
            </div>

            {/* Modern Monogram */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-[1.02]">
              <div className="flex justify-center mb-6">
                <div className={`w-32 h-32 bg-gradient-to-br ${currentScheme.primary} rounded-xl flex items-center justify-center shadow-lg relative group overflow-hidden`}>
                  <div className="font-bold text-white text-4xl tracking-wider relative z-10">HGP</div>
                  <div className="absolute inset-0 bg-gradient-to-br ${currentScheme.accent} opacity-20"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                </div>
              </div>
              <p className="text-steel-600 text-sm text-center">Modern Monogram</p>
            </div>

            {/* Stacked Monogram */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-[1.02]">
              <div className="flex justify-center mb-6">
                <div className={`w-32 h-32 bg-gradient-to-br ${currentScheme.primary} rounded-lg flex flex-col items-center justify-center shadow-lg relative group`}>
                  <div className="font-bold text-white text-3xl tracking-wider">H</div>
                  <div className="font-bold text-white text-3xl tracking-wider">G</div>
                  <div className="font-bold text-white text-3xl tracking-wider">P</div>
                  <div className="absolute inset-0 bg-gradient-to-br ${currentScheme.accent} opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                </div>
              </div>
              <p className="text-steel-600 text-sm text-center">Stacked Monogram</p>
            </div>

            {/* Geometric Monogram */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-[1.02]">
              <div className="flex justify-center mb-6">
                <div className={`w-32 h-32 bg-gradient-to-br ${currentScheme.primary} rounded-none flex items-center justify-center shadow-lg relative group`}>
                  <div className="font-bold text-white text-4xl tracking-tighter">HGP</div>
                  <div className="absolute inset-0 border-4 border-white/20"></div>
                  <div className="absolute inset-0 bg-gradient-to-br ${currentScheme.accent} opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                </div>
              </div>
              <p className="text-steel-600 text-sm text-center">Geometric Monogram</p>
            </div>

            {/* Minimal Monogram */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-[1.02]">
              <div className="flex justify-center mb-6">
                <div className={`w-32 h-32 bg-gradient-to-br ${currentScheme.primary} rounded-full flex items-center justify-center shadow-lg relative group`}>
                  <div className="font-light text-white text-4xl tracking-widest">HGP</div>
                  <div className="absolute inset-0 bg-gradient-to-br ${currentScheme.accent} opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                </div>
              </div>
              <p className="text-steel-600 text-sm text-center">Minimal Monogram</p>
            </div>

            {/* Industrial Monogram */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-[1.02]">
              <div className="flex justify-center mb-6">
                <div className={`w-32 h-32 bg-gradient-to-br ${currentScheme.primary} rounded-none flex items-center justify-center shadow-lg relative group`}>
                  <div className="font-black text-white text-4xl tracking-tighter">HGP</div>
                  <div className="absolute inset-0 border-4 border-white/10"></div>
                  <div className="absolute inset-0 bg-gradient-to-br ${currentScheme.accent} opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                </div>
              </div>
              <p className="text-steel-600 text-sm text-center">Industrial Monogram</p>
            </div>
          </div>
        </div>

        {/* Logo Showcase */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-steel-900 mb-8 text-center">Logo Variations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Standard Logo */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-[1.02]">
              <div className="flex items-center space-x-4 mb-6">
                <div className={`w-16 h-16 bg-gradient-to-br ${currentScheme.primary} rounded-lg flex items-center justify-center shadow-lg`}>
                  <span className="text-white text-2xl font-bold">HGP</span>
                </div>
                <div>
                  <h3 className={`text-xl font-bold ${currentScheme.text}`}>HOU GEN PROS</h3>
                  <p className="text-sm tracking-wider text-steel-500">Premium Power Solutions</p>
                </div>
              </div>
              <p className="text-steel-600 text-sm">Standard logo with company name and tagline</p>
            </div>

            {/* Icon Only */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-[1.02]">
              <div className="flex justify-center mb-6">
                <div className={`w-24 h-24 bg-gradient-to-br ${currentScheme.primary} rounded-xl flex items-center justify-center shadow-lg relative group overflow-hidden`}>
                  <span className="text-white text-3xl font-bold relative z-10">HGP</span>
                  <div className="absolute inset-0 bg-gradient-to-br ${currentScheme.accent} opacity-20"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                </div>
              </div>
              <p className="text-steel-600 text-sm text-center">Icon-only version for compact spaces</p>
            </div>

            {/* Horizontal Stack */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-[1.02]">
              <div className="flex items-center justify-center space-x-6 mb-6">
                <div className={`w-12 h-12 bg-gradient-to-br ${currentScheme.primary} rounded-lg flex items-center justify-center shadow-lg`}>
                  <span className="text-white text-lg font-bold">HGP</span>
                </div>
                <div className="border-l border-steel-200 h-12"></div>
                <div>
                  <h3 className={`text-xl font-bold ${currentScheme.text}`}>HOU GEN PROS</h3>
                  <p className="text-sm tracking-wider text-steel-500">Premium Power Solutions</p>
                </div>
              </div>
              <p className="text-steel-600 text-sm text-center">Horizontal layout for wide spaces</p>
            </div>
          </div>
        </div>

        {/* Color Palette */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-steel-900 mb-6 text-center">Color Palette</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="flex flex-col items-center">
              <div className={`w-20 h-20 bg-gradient-to-br ${currentScheme.primary} rounded-lg shadow-lg mb-2`}></div>
              <span className="text-sm text-steel-600">Primary</span>
            </div>
            <div className="flex flex-col items-center">
              <div className={`w-20 h-20 bg-gradient-to-br ${currentScheme.accent} rounded-lg shadow-lg mb-2`}></div>
              <span className="text-sm text-steel-600">Accent</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-steel-50 rounded-lg shadow-lg mb-2 border border-steel-200"></div>
              <span className="text-sm text-steel-600">Background</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-white rounded-lg shadow-lg mb-2 border border-steel-200"></div>
              <span className="text-sm text-steel-600">Surface</span>
            </div>
          </div>
        </div>

        {/* Typography */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-steel-900 mb-6 text-center">Typography</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="text-xl font-bold text-steel-900 mb-4">Headings</h3>
              <div className="space-y-4">
                <div>
                  <h1 className={`text-4xl ${currentStyle.text} ${currentScheme.text}`}>Heading 1</h1>
                  <p className="text-sm text-steel-500">40px / Bold</p>
                </div>
                <div>
                  <h2 className={`text-3xl ${currentStyle.text} ${currentScheme.text}`}>Heading 2</h2>
                  <p className="text-sm text-steel-500">32px / Bold</p>
                </div>
                <div>
                  <h3 className={`text-2xl ${currentStyle.text} ${currentScheme.text}`}>Heading 3</h3>
                  <p className="text-sm text-steel-500">24px / Bold</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="text-xl font-bold text-steel-900 mb-4">Body Text</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-lg text-steel-700">Body Large</p>
                  <p className="text-sm text-steel-500">18px / Regular</p>
                </div>
                <div>
                  <p className="text-base text-steel-700">Body Regular</p>
                  <p className="text-sm text-steel-500">16px / Regular</p>
                </div>
                <div>
                  <p className="text-sm text-steel-700">Body Small</p>
                  <p className="text-sm text-steel-500">14px / Regular</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandingShowcase; 