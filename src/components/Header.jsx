
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold text-primary">ContractorLeads</h1>
        </div>
        <nav className="flex items-center space-x-4">
          <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
            Dashboard
          </Link>
          <Button variant="default" size="sm">
            Add New Lead
          </Button>
        </nav>
      </div>
    </header>
  );
}
