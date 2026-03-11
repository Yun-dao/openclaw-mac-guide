import React, { useState, useMemo, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Search, Menu, X, ChevronRight, BookOpen, FileText, Copy, Check } from 'lucide-react';
import { tutorialData } from './data';

function CodeBlock({ children, className, ...rest }: any) {
  const match = /language-(\w+)/.exec(className || '');
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (match) {
    return (
      <div className="relative group bg-gray-900 rounded-xl overflow-hidden shadow-lg my-6">
        <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
          <span className="text-xs font-mono text-gray-400">{match[1]}</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-200 transition-colors"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
            {isCopied ? '已复制' : '复制'}
          </button>
        </div>
        <div className="p-4 overflow-x-auto text-gray-100 text-sm">
          <code className={className} {...rest}>
            {children}
          </code>
        </div>
      </div>
    );
  }
  return (
    <code className={className} {...rest}>
      {children}
    </code>
  );
}

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState(tutorialData[0].id);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Filter sections based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return tutorialData;
    const query = searchQuery.toLowerCase();
    return tutorialData.filter(
      (section) =>
        section.title.toLowerCase().includes(query) ||
        section.content.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // If active section is filtered out, select the first available one
  useEffect(() => {
    if (filteredData.length > 0 && !filteredData.find(s => s.id === activeSection)) {
      setActiveSection(filteredData[0].id);
    }
  }, [filteredData, activeSection]);

  const currentSection = filteredData.find(s => s.id === activeSection) || filteredData[0];

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed md:static inset-y-0 left-0 z-30 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out flex flex-col shadow-xl md:shadow-none ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5 text-indigo-600 font-bold text-lg tracking-tight">
            <BookOpen className="w-5 h-5" />
            <span>OpenClaw 教程</span>
          </div>
          <button 
            className="md:hidden p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="搜索教程内容..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none shadow-sm placeholder:text-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin scrollbar-thumb-gray-200">
          {filteredData.length === 0 ? (
            <div className="text-center text-gray-500 text-sm py-8 flex flex-col items-center gap-2">
              <FileText className="w-8 h-8 text-gray-300" />
              <p>没有找到匹配的内容</p>
            </div>
          ) : (
            filteredData.map((section) => (
              <button
                key={section.id}
                onClick={() => {
                  setActiveSection(section.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all flex items-center justify-between group ${
                  activeSection === section.id
                    ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm ring-1 ring-indigo-100'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className="truncate pr-2">{section.title}</span>
                <ChevronRight className={`w-4 h-4 transition-all ${
                  activeSection === section.id 
                    ? 'opacity-100 text-indigo-500 translate-x-0' 
                    : 'opacity-0 -translate-x-2 text-gray-400 group-hover:opacity-100 group-hover:translate-x-0'
                }`} />
              </button>
            ))
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white relative">
        <header className="h-14 border-b border-gray-200 flex items-center px-4 md:hidden shrink-0 bg-white sticky top-0 z-10">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="ml-2 font-medium text-gray-900 truncate">
            {currentSection?.title || 'OpenClaw 教程'}
          </span>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-12 lg:p-16 scroll-smooth">
          <div className="max-w-3xl mx-auto">
            {currentSection ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-8 pb-6 border-b border-gray-100">
                  {currentSection.title}
                </h1>
                <div className="prose prose-indigo prose-sm sm:prose-base max-w-none prose-headings:font-semibold prose-a:text-indigo-600 hover:prose-a:text-indigo-500 prose-blockquote:border-l-indigo-500 prose-blockquote:bg-indigo-50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:text-gray-700 prose-code:text-indigo-600 prose-code:bg-indigo-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none prose-pre:p-0 prose-pre:bg-transparent prose-pre:m-0">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code: CodeBlock
                    }}
                  >
                    {currentSection.content}
                  </ReactMarkdown>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}
