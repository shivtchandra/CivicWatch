
import React from 'react';

const CountryNotice = ({ country }: { country: string }) => {
  if (!country) return null;
  return (
    <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
      <p className="text-sm text-green-700">
        Reporting for country: <strong>{country}</strong>
      </p>
    </div>
  );
};

export default CountryNotice;
